import { createSelector } from 'reselect'
import { insetSourceFrom, dateMin, dateMax, isLatitude, isLongitude } from '../common/utilities'
import { isTimeRangedIn } from './helpers'
import { ASSOCIATION_MODES } from '../common/constants'

// Input selectors
export const getEvents = state => state.domain.events
export const getCategories = state => state.domain.associations.filter(item => item.mode === ASSOCIATION_MODES.CATEGORY)
export const getNarratives = state => state.domain.associations.filter(item => item.mode === ASSOCIATION_MODES.NARRATIVE)
export const getActiveNarrative = state => state.app.associations.narrative
export const getSelected = state => state.app.selected
export const getSites = state => state.domain.sites
export const getSources = state => state.domain.sources
export const getShapes = state => state.domain.shapes
export const getFilters = state => state.domain.associations.filter(item => item.mode === ASSOCIATION_MODES.FILTER)
export const getNotifications = state => state.domain.notifications
export const getActiveFilters = state => state.app.associations.filters
export const getActiveCategories = state => state.app.associations.categories
export const getTimeRange = state => state.app.timeline.range
export const getTimelineDimensions = state => state.app.timeline.dimensions
export const selectNarrative = state => state.app.associations.narrative
export const getFeatures = state => state.features
export const getEventRadius = state => state.ui.eventRadius

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
 * 2. exist in an active filter
 * 3. exist in an active category
 */
export const selectEvents = createSelector(
  [getEvents, getActiveFilters, getActiveCategories, getTimeRange, getFeatures],
  (events, activeFilters, activeCategories, timeRange, features) => {
    return events.reduce((acc, event) => {
      const isMatchingFilter = (event.associations &&
        event.associations.map(association =>
          activeFilters.includes(association))
          .some(s => s)
      ) || activeFilters.length === 0
      const isActiveFilter = isMatchingFilter || activeFilters.length === 0
      const isActiveCategory = (event.associations &&
        event.associations.map(association =>
          activeCategories.includes(association))
          .some(s => s)
      ) || activeCategories.length === 0
      let isActiveTime = isTimeRangedIn(event, timeRange)
      isActiveTime = features.GRAPH_NONLOCATED
        ? ((!event.latitude && !event.longitude) || isActiveTime)
        : isActiveTime

      if (isActiveTime && isActiveFilter && isActiveCategory) {
        acc[event.id] = { ...event }
      }
      return acc
    }, [])
  })

/**
 * Of all available events, selects those that fall within the time range,
 * and if filters are being used, select them if their filters are enabled
 */
export const selectNarratives = createSelector(
  [getEvents, getNarratives, getSources, getFeatures],
  (events, narrativesMeta, sources, features) => {
    if (Array.isArray(narrativesMeta) && narrativesMeta.length === 0) {
      return []
    }
    const narratives = {}
    const narrativeSkeleton = id => ({ id, steps: [] })

    /* populate narratives dict with events */
    events.forEach(evt => {
      evt.associations.forEach(association => {
        const foundNarrative = narrativesMeta.find(narr => narr.id === association)
        if (foundNarrative) {
          const { id: narrId } = foundNarrative
          // initialise
          if (!narratives[narrId]) { narratives[narrId] = narrativeSkeleton(narrId) }
          // add evt to steps
          // NB: insetSourceFrom is a 'curried' function to allow with maps
          narratives[narrId].steps.push(insetSourceFrom(sources)(evt))
        }
      })
    })
    /* sort steps by time */
    Object.keys(narratives).forEach(key => {
      const steps = narratives[key].steps

      steps.sort((a, b) => a.datetime - b.datetime)

      const existingAssociatedNarrative = narrativesMeta.find(n => n.id === key)

      if (existingAssociatedNarrative) {
        narratives[key] = {
          ...existingAssociatedNarrative,
          ...narratives[key]
        }
      }
    })
    // Return narratives in original order
    // + filter those that are undefined
    return narrativesMeta.map(n => narratives[n.id]).filter(d => d)
  })

/** We iterate through narrative.steps and check the idx there against the selected array and we return the idx */
export const selectNarrativeIdx = createSelector(
  [getSelected, getActiveNarrative],
  (selected, narrative) => {
    // Only one event selected in narrative mode
    if (narrative === null) return -1

    const selectedEvent = selected[0]
    let selectedIdx

    narrative.steps.forEach((step, idx) => {
      if (selectedEvent.id === step.id) {
        selectedIdx = idx
      }
    })
    return selectedIdx
  }
)

/** Aggregate information about the narrative and the current step into
 *  a single object. If narrative is null, the whole object is null.
 */
export const selectActiveNarrative = createSelector(
  [getActiveNarrative, selectNarrativeIdx],
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
      const { latitude, longitude } = event
      if (!isLatitude(latitude) || !isLongitude(longitude)) return

      const location = `${event.location}$_${event.latitude}_${event.longitude}`

      if (activeLocations[location]) {
        activeLocations[location].events.push(event)
      } else {
        activeLocations[location] = {
          label: location,
          events: [event],
          id: event.id,
          latitude: event.latitude,
          longitude: event.longitude
        }
      }
    })

    return Object.values(activeLocations)
  }
)

export const selectEventsWithProjects = createSelector(
  [selectEvents, getFeatures, getEventRadius],
  (events, features, eventRadius) => {
    if (!features.GRAPH_NONLOCATED) {
      return [events, []]
    }
    const projSize = 2 * eventRadius
    const projectIdx = features.GRAPH_NONLOCATED.projectIdx || 0
    const getProject = ev => ev.filters[projectIdx]
    const projects = {}

    // get all projects
    events = events.reduce((acc, event) => {
      const project = event.filters.length >= 1 && !event.latitude && !event.longitude ? getProject(event) : null

      // add project if it doesn't exist
      if (project !== null) {
        if (projects.hasOwnProperty(project)) {
          projects[project].start = dateMin(projects[project].start, event.datetime)
          projects[project].end = dateMax(projects[project].end, event.datetime)
        } else {
          projects[project] = {
            start: event.datetime,
            end: event.datetime,
            key: project,
            category: event.category
          }
        }
      }
      acc.push({ ...event, project })
      return acc
    }, [])

    let projObjs = Object.values(projects)
    projObjs.sort((a, b) => a.start - b.start)

    // active projects is a data structure with projObjs.length empty slots
    let activeProjs = Object.keys(projects).map((_, idx) => null)

    const projectsWithOffset = projObjs.reduce((acc, proj, theIdx) => {
      // remove any project that have ended from slots
      activeProjs.forEach((theProj, theProjIdx) => {
        if (theProj !== null) {
          const projInSlot = projects[theProj]
          if (projInSlot.end < proj.start) {
            activeProjs[theProjIdx] = null
          }
        }
      })
      let i = 0
      // find the first empty slot
      while (activeProjs[i]) i++
      // put proj in slot
      activeProjs[i] = proj.key

      proj.offset = i * projSize
      acc[proj.key] = proj
      return acc
    }, {})

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
