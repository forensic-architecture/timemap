import {
  createSelector
} from 'reselect'

// Input selectors
export const getEvents = state => state.domain.events
export const getLocations = state => state.domain.locations
export const getCategories = state => state.domain.categories
export const getSites = (state) => {
  if (process.env.features.USE_SITES) return state.domain.sites
  return []
}
export const getAllTags = state => state.domain.tags

export const getCategoriesFilter = state => state.app.filters.categories
export const getTagsFilter = state => state.app.filters.tags
export const getRangeFilter = state => state.app.filters.range

// NB: should we stick with the default semantics and name these as selectors?
// e.g. 'selectEvents', 'selectCoevents'.
// Filter events
function isTaggedIn (event, tagFilters) {
  if (event.tags) {
    const tagsArray = event.tags.split(',')
    const isTagged = tagsArray.some((tag) => {
      return tagFilters.find((tagFilter) => {
        return (tagFilter.key === tag && tagFilter.active)
      })
    })
    return isTagged
  } else {
    return false
  }
}

/**
 * Of all available events, selects those that fall within the time range,
 * and if TAGS are being used, select them if their tags are enabled
 */
export const getFilteredEvents = createSelector(
  [getEvents, getTagsFilter, getRangeFilter],
  (events, tagFilters, rangeFilter) => {
    return events.reduce((acc, value) => {
      const noTags = (tagFilters.length === 0 || !process.env.features.USE_TAGS || tagFilters.every(t => !t.active))

      const isTagged = (noTags) || isTaggedIn(value, tagFilters)

      // TODO: put this datetime format as a constant
      const isRange = (rangeFilter[0] < d3.timeParse('%Y-%m-%dT%H:%M:%S')(value.timestamp)) &&
          (d3.timeParse('%Y-%m-%dT%H:%M:%S')(value.timestamp) < rangeFilter[1])

<<<<<<< HEAD
      if (isRange && isTagged) {
        const event = Object.assign({}, value)
        acc[event.id] = event
      }
      return acc
    }, [])
  }
)
=======
        const isRange = (rangeFilter[0] < d3.timeParse("%Y-%m-%dT%H:%M:%S")(value.timestamp)) &&
            (d3.timeParse("%Y-%m-%dT%H:%M:%S")(value.timestamp) < rangeFilter[1]);

        if (isRange && isTagged) {
          const event = Object.assign({}, value);
          acc[event.id] = event;
        }

        return acc;
    }, []);
});
>>>>>>> Add selector and reducer for narrative

/**
 * Of all available events, selects those that fall within the time range,
 * and if TAGS are being used, select them if their tags are enabled
 */
const parseTimestamp = ts => d3.timeParse("%Y-%m-%dT%H:%M:%S")(ts);
export const getFilteredNarratives = createSelector(
    [getEvents, getTagsFilter, getRangeFilter],
    (events, tagFilters, rangeFilter) => {

      const narratives = {};
      events.forEach((evt) => {
        const noTags = (tagFilters.length === 0 || !process.env.features.USE_TAGS || tagFilters.every(t => !t.active));

        const isTagged = (noTags) || isTaggedIn(evt, tagFilters);
        const isRange = (rangeFilter[0] < parseTimestamp(evt.timestamp)) &&
            (parseTimestamp(evt.timestamp) < rangeFilter[1]);

        if (isRange && isTagged && evt.narrative) {
          if (!narratives[evt.narrative]) narratives[evt.narrative] = { key: evt.narrative, steps: [], byId: {} };
          narratives[evt.narrative].steps.push(evt);
          narratives[evt.narrative].byId[evt.id] = { next: null, prev: null };
        }
      });
      Object.keys(narratives).forEach((key) => {
        const steps = narratives[key].steps;
        steps.sort((a, b) => {
          return (parseTimestamp(a.timestamp) > parseTimestamp(b.timestamp));
        });
        steps.forEach((step, i) => {
          narratives[key].byId[step.id].next = (i < steps.length - 2) ? steps[i + 1] : null;
          narratives[key].byId[step.id].prev = (i > 0) ? steps[i - 1] : null;
        });
      })
      return Object.values(narratives);
});

/**
 * Of all the filtered events, group them by location and return a list of
 * locations with at least one event in it, based on the time range and tags
 */
export const getFilteredLocations = createSelector(
  [getFilteredEvents],
  (events) => {
    const filteredLocations = {}
    events.forEach(event => {
      const location = event.location
      if (filteredLocations[location]) {
        filteredLocations[location].events.push(event)
      } else {
        filteredLocations[location] = {
          label: location,
          events: [event],
          latitude: event.latitude,
          longitude: event.longitude
        }
      }
    })

    // Make locations an array are remove if any are undefined
    return Object.values(filteredLocations).filter(item => item)
  }
)

// Filter categories
export const getFilteredCategories = createSelector(
  [getCategories],
  (categories) => Object.values(categories))

/**
 * Return categories by group
 */
export const getCategoryGroups = createSelector(
  [getFilteredCategories],
  (categories) => {
    const groups = {}
    categories.forEach((t) => { if (t.group && !groups[t.group]) { groups[t.group] = t.group_label } })
    return Object.keys(groups).concat(['other'])
  }
)

/**
 * Given a tree of tags, return those tags as a list, where each node has been
 * aware of its depth, and given an 'active' flag
 */
export const getTagFilters = createSelector(
  [getAllTags],
  (tags) => {
    const allTagFilters = []
    let depth = 0
    function traverseNode (node, depth) {
      node.active = (!node.hasOwnProperty('active')) ? false : node.active
      node.depth = depth
      if (node.active) allTagFilters.push(node)
      depth = depth + 1

      if (Object.keys(node.children).length > 0) {
        Object.values(node.children).forEach((childNode) => {
          traverseNode(childNode, depth)
        })
      }
    }

    if (tags && tags.key && tags.children) traverseNode(tags, depth)
    return allTagFilters
  }
)
