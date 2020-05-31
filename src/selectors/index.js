import { createSelector } from 'reselect'
import { insetSourceFrom, dateMin, dateMax } from '../common/utilities'
import { isTimeRangedIn } from './helpers'
import { sizes } from '../common/global'

// Input selectors
export const getEvents = state => state.domain.events
export const getCategories = state => state.domain.categories
export const getNarratives = state => state.domain.narratives
export const getActiveNarrative = state => state.app.narrative
export const getActiveStep = state => state.app.narrativeState.current
export const getSelected = state => state.app.selected
export const getSites = state => state.domain.sites
export const getSources = state => state.domain.sources
export const getShapes = state => state.domain.shapes
export const getNotifications = state => state.domain.notifications
export const getTagTree = state => state.domain.tags
export const getActiveTags = state => state.app.filters.tags
export const getActiveCategories = state => state.app.filters.categories
export const getTimeRange = state => state.app.timeline.range
export const getTimelineDimensions = state => state.app.timeline.dimensions
export const selectNarrative = state => state.app.narrative
export const getFeatures = state => state.features

export const selectSites = createSelector([getSites, getFeatures], (sites, features) => {
  if (features.USE_SITES) {
    return sites.filter(s => !!(+s.enabled))
  }
  return []
})

export const selectSources = createSelector([getSources, getFeatures], (sources, features) => {
  if (features.USE_SOURCES) return sources
  return {}
})

export const selectShapes = createSelector([getShapes, getFeatures], (shapes, features) => {
  if (features.USE_SHAPES) return shapes
  return []
})

/**
 * Of all available events, selects those that
 * 1. fall in time range
 * 2. exist in an active tag
 * 3. exist in an active category
 */
export const selectEvents = createSelector(
  [getEvents, getActiveTags, getActiveCategories, getTimeRange, getFeatures],
  (events, activeTags, activeCategories, timeRange, features) => {
    return events.reduce((acc, event) => {
      const isMatchingTag = (event.tags && event.tags.map(tag => activeTags.includes(tag)).some(s => s)) || activeTags.length === 0
      const isActiveTag = isMatchingTag || activeTags.length === 0
      const isActiveCategory = activeCategories.includes(event.category) || activeCategories.length === 0
      let isActiveTime = isTimeRangedIn(event, timeRange)
      isActiveTime = features.GRAPH_NONLOCATED ? ((!event.latitude && !event.longitude) || isActiveTime) : isActiveTime

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
  [getEvents, getNarratives, getSources, getFeatures],
  (events, narrativesMeta, sources, features) => {
    if (!features.USE_NARRATIVES) {
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

      steps.sort((a, b) => a.datetime - b.datetime)

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

export const selectEventsWithProjects = createSelector(
  [selectEvents, getFeatures],
  (events, features) => {
    if (!features.GRAPH_NONLOCATED) {
      return [events, []]
    }
    const projSize = 2 * sizes.eventDotR
    const projectIdx = features.GRAPH_NONLOCATED.projectIdx || 0
    const getProject = ev => ev.tags[projectIdx]
    const projects = {}

    // get all projects
    events = events.reduce((acc, event) => {
      const project = event.tags.length >= 1 && !event.latitude && !event.longitude ? getProject(event) : null

      // add project if it doesn't exist
      if (project !== null) {
        if (projects.hasOwnProperty(project)) {
          projects[project].start = dateMin(projects[project].start, event.datetime)
          projects[project].end = dateMax(projects[project].end, event.datetime)
        } else {
          projects[project] = { start: event.datetime, end: event.datetime, key: project }
        }
      }
      acc.push({ ...event, project })
      return acc
    }, [])

    let projObjs = Object.values(projects)
    projObjs.sort((a, b) => a.start - b.start)

    // active projects is a data structure with projObjs.length empty slots
    let activeProjs = {}
    projObjs.forEach((_, idx) => { activeProjs[idx] = null })

    const projectsWithOffset = projObjs.reduce((acc, proj, theIdx) => {
      if (theIdx >= 1) { acc[proj.key] = proj; return acc }
      // remove any project that have ended from slots
      let j = 0
      while (j < projObjs.length) {
        if (!activeProjs[j]) {
          j++
          continue
        }
        const projInSlot = projects[activeProjs[j]]
        if (projInSlot.end > proj.start) {
          activeProjs[j] = null
        }
        j++
      }
      let i = 0
      // find the first empty slot
      while (activeProjs[i]) i++
      // put proj in slot
      activeProjs[i] = proj.key

      proj.offset = i * projSize
      console.log(`${proj.key}:-- ${proj.offset}`)
      acc[proj.key] = proj
      return acc
    }, {})

    /*
    events = events.reduce((acc, event) => {
      const activeProjects = []
      projKeys.forEach((k, idx) => {
        if (event.timestamp >= projects[k].start && event.timestamp <= projects[k].end) {
          activeProjects.push(k)
        }
      })

      // infer projectOffset using activeProjects
      // TODO(lachlan) projects get overlaid if they start at the same time...
      const activeIdx = activeProjects.indexOf(event.project)
      let projectOffset = activeIdx * projSize
      if (activeIdx === -1) {
        // project isn't in previously calculated list of projects
        projectOffset = -1
      }
      if (event.project !== null) {
        if (projects[event.project].hasOwnProperty('offset')) {
          // project is already active
          projectOffset = (activeIdx + 1) * projSize
        }
        projects[event.project].offset = projectOffset
        projects[event.project].category = event.category
      } else if (event.project !== null) {
        projectOffset = projects[event.project].offset
      }
      acc.push({ ...event, projectOffset })
      return acc
    }, [])
    */

    return [events, projectsWithOffset]
  }
)

export const selectStackedEvents = createSelector(
  [selectEventsWithProjects],
  eventsWithProjects => {
    return eventsWithProjects[0]
  }
)

export const selectProjects = createSelector(
  [selectEventsWithProjects, getFeatures],
  (eventsWithProjects, features) => {
    if (!features.GRAPH_NONLOCATED) {
      return []
    }
    return eventsWithProjects[1]
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
