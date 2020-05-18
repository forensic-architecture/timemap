import { createSelector } from 'reselect'
import { compareTimestamp, insetSourceFrom, dateMin, dateMax } from '../common/utilities'
import { isTimeRangedIn, shuffle } from './helpers'
import { sizes } from '../common/global'
const GRAPH_NONLOCATED = 'GRAPH_NONLOCATED' in process.env.features && process.env.features.GRAPH_NONLOCATED

// Input selectors
export const getEvents = state => state.domain.events
export const getCategories = state => state.domain.categories
export const getNarratives = state => state.domain.narratives
export const getActiveNarrative = state => state.app.narrative
export const getActiveStep = state => state.app.narrativeState.current
export const getSelected = state => state.app.selected
export const getSites = (state) => {
  if (process.env.features.USE_SITES) return state.domain.sites.filter(s => !!(+s.enabled))
  return []
}
export const getSources = state => {
  if (process.env.features.USE_SOURCES) return state.domain.sources
  return {}
}
export const getShapes = state => {
  if (process.env.features.USE_SHAPES) return state.domain.shapes
  return []
}
export const getNotifications = state => state.domain.notifications
export const getTagTree = state => state.domain.tags
export const getActiveTags = state => state.app.filters.tags
export const getActiveCategories = state => state.app.filters.categories
export const getTimeRange = state => state.app.timeline.range
export const getTimelineDimensions = state => state.app.timeline.dimensions
export const selectNarrative = state => state.app.narrative

/**
 * Of all available events, selects those that
 * 1. fall in time range
 * 2. exist in an active tag
 * 3. exist in an active category
 */
export const selectEvents = createSelector(
  [getEvents, getActiveTags, getActiveCategories, getTimeRange],
  (events, activeTags, activeCategories, timeRange) => {
    return events.reduce((acc, event) => {
      const isMatchingTag = (event.tags && event.tags.map(tag => activeTags.includes(tag)).some(s => s)) || activeTags.length === 0
      const isActiveTag = isMatchingTag || activeTags.length === 0
      const isActiveCategory = activeCategories.includes(event.category) || activeCategories.length === 0
      let isActiveTime = isTimeRangedIn(event, timeRange)
      isActiveTime = GRAPH_NONLOCATED ? ((!event.latitude && !event.longitude) || isActiveTime) : isActiveTime

      if (isActiveTime && isActiveTag && isActiveCategory) {
        acc[event.id] = { ...event }
      }

      return acc
    }, [])
  })

/**
 * Of all available events, selects those that fall within the time range,
 * and if TAGS are being used, select them if their tags are enabled
 */
export const selectNarratives = createSelector(
  [getEvents, getNarratives, getSources],
  (events, narrativesMeta, sources) => {
    if (!process.env.features.USE_NARRATIVES) {
      return []
    }
    const narratives = {}
    const narrativeSkeleton = id => ({ id, steps: [] })

    /* populate narratives dict with events */
    events.forEach(evt => {
      const isInNarrative = evt.narratives.length > 0

      evt.narratives.forEach(narrative => {
        // initialise
        if (!narratives[narrative]) { narratives[narrative] = narrativeSkeleton(narrative) }

        // add evt to steps
        if (isInNarrative) {
          // NB: insetSourceFrom is a 'curried' function to allow with maps
          narratives[narrative].steps.push(insetSourceFrom(sources)(evt))
        }
      })
    })

    /* sort steps by time */
    Object.keys(narratives).forEach(key => {
      const steps = narratives[key].steps

      steps.sort(compareTimestamp)

      if (narrativesMeta.find(n => n.id === key)) {
        narratives[key] = {
          ...narrativesMeta.find(n => n.id === key),
          ...narratives[key]
        }
      }
    })

    // Return narratives in original order
    // + filter those that are undefined
    return narrativesMeta.map(n => narratives[n.id]).filter(d => d)
  })

/** Aggregate information about the narrative and the current step into
 *  a single object. If narrative is null, the whole object is null.
 */
export const selectActiveNarrative = createSelector(
  [getActiveNarrative, getActiveStep],
  (narrative, current) => narrative
    ? { ...narrative, current }
    : null
)

/**
 * Group events by location. Each location is an object:
  {
    events: [...],
    label: 'Location name',
    latitude: '47.7',
    longitude: '32.2'
  }
 */
export const selectLocations = createSelector(
  [selectEvents],
  (events) => {
    const activeLocations = {}
    events.forEach(event => {
      const location = event.location

      if (activeLocations[location]) {
        activeLocations[location].events.push(event)
      } else {
        activeLocations[location] = {
          label: location,
          events: [event],
          latitude: event.latitude,
          longitude: event.longitude
        }
      }
    })

    return Object.values(activeLocations)
  }
)

export const selectProjectedEvents = createSelector(
  [selectEvents],
  events => {

  }
)

/**
 * Group events by 'datetime'. Each datetime is  an object:
  {
    timestamp: '',
    date: '8/23/2016',
    time: '12:00',
    events: [...]
  }
 */
export const selectEventsAndProjects = createSelector(
  [selectEvents],
  events => {
    if (!GRAPH_NONLOCATED) {
      return [events, []]
    }

    // NOTE: change this line if you want to extract projects from a different column
    function getProject (ev) {
      return ev.tags[0]
    }

    events.sort((a, b) => {
      const x = a.timestamp.substring(0, a.timestamp.length - 2)
      const y = b.timestamp.substring(0, b.timestamp.length - 2)
      return new Date(x) - new Date(y)
    })

    // reduce events to get projects
    const projects = {}
    // const activeProjects = []
    const projEvents = events.reduce((acc, event) => {
      const project = event.tags.length >= 1 && !event.latitude && !event.longitude ? getProject(event) : null

      // add project if it doesn't exist
      if (project !== null) {
        if (projects.hasOwnProperty(project)) {
          projects[project].start = dateMin(projects[project].start, event.timestamp)
          projects[project].end = dateMax(projects[project].end, event.timestamp)
        } else {
          projects[project] = { start: event.timestamp, end: event.timestamp }
        }
      }
      acc.push({ ...event, project })
      return acc
    }, [])

    // reduce projEvents to get _events
    const projKeys = Object.keys(projects)
    const _events = projEvents.reduce((acc, event) => {
      // infer activeProjects from timestamp
      const activeProjects = []
      projKeys.forEach((k, idx) => {
        if (event.timestamp >= projects[k].start && event.timestamp <= projects[k].end) {
          activeProjects.push(k)
        }
      })

      // infer projectOffset using activeProjects
      // TODO(lachlan) projects get overlaid on the first layer...
      const activeIdx = activeProjects.indexOf(event.project)
      let projectOffset = (activeIdx + 3) * (2.5 * sizes.eventDotR)
      if (activeIdx === -1) {
        projectOffset = -1
      }
      if (event.project !== null && !projects[event.project].hasOwnProperty('offset')) {
        projects[event.project].offset = projectOffset
        projects[event.project].category = event.category
      } else if (event.project !== null) {
        projectOffset = projects[event.project].offset
      }
      acc.push({ ...event, projectOffset })
      return acc
    }, [])

    const _projects = []
    projKeys.forEach(projId => {
      _projects.push({ ...projects[projId], id: projId })
    })

    return [_events, _projects]
  }
)

/**
 * Of all the sources, select those that are relevant to the selected events.
 */
export const selectSelected = createSelector(
  [getSelected, getSources],
  (selected, sources) => {
    if (selected.length === 0) {
      return []
    }

    return selected.map(insetSourceFrom(sources))
  }
)

export const selectDimensions = createSelector(
  [getTimelineDimensions],
  (dimensions) => {
    return {
      ...dimensions,
      trackHeight: dimensions.contentHeight - 50 // height of time labels
    }
  }
)
