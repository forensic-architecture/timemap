import { createSelector} from 'reselect'
import { parseTimestamp, compareTimestamp, insetSourceFrom } from '../js/utilities'

// Input selectors
export const getEvents = state => state.domain.events
export const getLocations = state => state.domain.locations
export const getCategories = state => state.domain.categories
export const getNarratives = state => state.domain.narratives
export const getActiveNarrative = state => state.app.narrative
export const getActiveStep = state => state.app.narrativeState.current
export const getSelected = state => state.app.selected
export const getSites = (state) => {
  if (process.env.features.USE_SITES) return state.domain.sites
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
export const getTagsFilter = state => state.app.filters.tags
export const getCategoriesFilter = state => state.app.filters.categories
export const getTimeRange = state => state.app.timeline.range


/**
* Some handy helpers
*/

/**
 * Given an event and all tags,
 * returns true/false if event has any tag that is active
 */
function isTaggedIn(event, tagFilters) {
  if (event.tags) {
    const isTagged = event.tags.some((tag) => {
      return tagFilters.find(tF => (tF.key === tag && tF.active))
    })
    return isTagged
  } else {
    return false
  }
}

/**
 * Given an event and all categories,
 * returns true/false if event has a category that is active
 */
function isTaggedInWithCategory(event, categories) {
  if (event.category) {
    if (categories.find(c => (c.category === event.category && c.active))) return true
    return false;
  } else {
    return false
  }
}

/*
* Returns true if no tags are selected
*/
function isNoTags(tagFilters) {
  return (
    tagFilters.length === 0
    || !process.env.features.USE_TAGS
    || tagFilters.every(t => !t.active)
  )
}

/*
* Returns true if no categories are selected
*/
function isNoCategories(categories) {
  return (
    categories.length === 0
    || !process.env.features.CATEGORIES_AS_TAGS
    || categories.every(c => !c.active)
  )
}

/**
 * Given an event and a time range,
 * returns true/false if the event falls within timeRange
 */
function isTimeRangedIn(event, timeRange) {
  return (
    timeRange[0] < parseTimestamp(event.timestamp)
    && parseTimestamp(event.timestamp) < timeRange[1]
  )
}

/**
 * Of all available events, selects those that fall within the time range,
 * and if TAGS are being used, select them if their tags are enabled
 */
export const selectEvents = createSelector(
    [getEvents, getTagsFilter, getCategoriesFilter, getTimeRange],
    (events, tagFilters, categories, timeRange) => {

      return events.reduce((acc, event) => {
        const isTagged = isTaggedIn(event, tagFilters) || isNoTags(tagFilters)
        const isTaggedWithCategory = isTaggedInWithCategory(event, categories) || isNoCategories(categories)
        const isTimeRanged = isTimeRangedIn(event, timeRange)

        if (isTimeRanged && isTagged && isTaggedWithCategory) {
          const eventClone = Object.assign({}, event)
          acc[event.id] = eventClone
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

      const narratives = {}
      const narrativeSkeleton = id => ({ id, steps: [] })

      /* populate narratives dict with events */
      events.forEach(evt => {
        const isInNarrative =  evt.narratives.length > 0

        evt.narratives.forEach(narrative => {
          // initialise
          if (!narratives[narrative])
            narratives[narrative] = narrativeSkeleton(narrative)

          // add evt to steps
          if (isInNarrative)
            // NB: insetSourceFrom is a 'curried' function to allow with maps
            narratives[narrative].steps.push(insetSourceFrom(sources)(evt))
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
      return narrativesMeta.map(n => narratives[n.id]).filter(d => d);
})

/** Aggregate information about the narrative and the current step into
 *  a single object. If narrative is null, the whole object is null.
 */
export const selectActiveNarrative = createSelector(
  [getActiveNarrative, getActiveStep],
  (narrative, current) => !!narrative
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

    const selectedLocations = {}
    events.forEach(event => {
      const location = event.location

      if (selectedLocations[location]) {
        selectedLocations[location].events.push(event)
      } else {
        selectedLocations[location] = {
          label: location,
          events: [event],
          latitude: event.latitude,
          longitude: event.longitude
        }
      }
    })
    return Object.values(selectedLocations)
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
export const selectDatetimes = createSelector(
  [selectEvents],
  events => {
    const datetimes = {}
    events.forEach(event => {
      const { timestamp } = event
      if (datetimes.hasOwnProperty(timestamp)) {
        datetimes[timestamp].events.push(event)
      } else {
        datetimes[timestamp] = {
          timestamp: event.timestamp,
          date: event.date,
          time: event.time,
          events: [event]
        }
      }
    })
    return Object.values(datetimes)
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

/*
* Select categories, return them as a list
*/
export const selectCategories = createSelector(
  [getCategories],
  (categories) => {
    categories.map(cat => {
      cat.active = (!cat.hasOwnProperty('active')) ? false : cat.active
    });
    return categories;
  }
)


/**
 * Given a tree of tags, return those tags as a list
 * Each node has been aware of its depth, and given an 'active' flag
 */
export const selectTagList = createSelector(
  [getTagTree],
  (tags) => {
    const tagList = []
    let depth = 0
    function traverseNode(node, depth) {
      node.active = (!node.hasOwnProperty('active')) ? false : node.active
      node.depth = depth

      if (node.active) tagList.push(node)

      if (Object.keys(node.children).length > 0) {
        Object.values(node.children).forEach((childNode) => {
          traverseNode(childNode, depth + 1)
        })
      }
    }
    if (tags && tags !== undefined) {
      if (tags.key && tags.children) traverseNode(tags, depth)
    }
    return tagList
  }
)
