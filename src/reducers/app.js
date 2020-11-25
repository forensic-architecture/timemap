import initial from '../store/initial.js'
import { ASSOCIATION_MODES } from '../common/constants'
import { toggleFlagAC } from '../common/utilities'

import {
  UPDATE_HIGHLIGHTED,
  UPDATE_SELECTED,
  UPDATE_COLORING_SET,
  CLEAR_FILTER,
  TOGGLE_ASSOCIATIONS,
  UPDATE_TIMERANGE,
  UPDATE_DIMENSIONS,
  UPDATE_NARRATIVE,
  UPDATE_NARRATIVE_STEP_IDX,
  UPDATE_SOURCE,
  TOGGLE_LANGUAGE,
  TOGGLE_SITES,
  TOGGLE_FETCHING_DOMAIN,
  TOGGLE_FETCHING_SOURCES,
  TOGGLE_INFOPOPUP,
  TOGGLE_INTROPOPUP,
  TOGGLE_NOTIFICATIONS,
  TOGGLE_COVER,
  FETCH_ERROR,
  FETCH_SOURCE_ERROR,
  SET_LOADING,
  SET_NOT_LOADING,
  SET_INITIAL_CATEGORIES,
  UPDATE_SEARCH_QUERY
} from '../actions'

function updateHighlighted (appState, action) {
  return Object.assign({}, appState, {
    highlighted: action.highlighted
  })
}

function updateSelected (appState, action) {
  return Object.assign({}, appState, {
    selected: action.selected
  })
}

function updateColoringSet (appState, action) {
  return {
    ...appState,
    associations: {
      ...appState.associations,
      coloringSet: action.coloringSet
    }
  }
}

function updateNarrative (appState, action) {
  let minTime = appState.timeline.range[0]
  let maxTime = appState.timeline.range[1]

  let cornerBound0 = [180, 180]
  let cornerBound1 = [-180, -180]

  // Compute narrative time range and map bounds
  if (action.narrative) {
    // Forced to comment out min and max time changes, not sure why?
    minTime = appState.timeline.rangeLimits[0]
    maxTime = appState.timeline.rangeLimits[1]

    // Find max and mins coordinates of narrative events
    action.narrative.steps.forEach(step => {
      const stepTime = step.datetime
      if (stepTime < minTime) minTime = stepTime
      if (stepTime > maxTime) maxTime = stepTime

      if (!!step.longitude && !!step.latitude) {
        if (+step.longitude < cornerBound0[1]) cornerBound0[1] = +step.longitude
        if (+step.longitude > cornerBound1[1]) cornerBound1[1] = +step.longitude
        if (+step.latitude < cornerBound0[0]) cornerBound0[0] = +step.latitude
        if (+step.latitude > cornerBound1[0]) cornerBound1[0] = +step.latitude
      }
    })
    // Adjust bounds to center around first event, while keeping visible all others
    // Takes first event, finds max ditance with first attempt bounds, and use this max distance
    // on the other side, both in latitude and longitude
    const first = action.narrative.steps[0]
    if (!!first.longitude && !!first.latitude) {
      const firstToLong0 = Math.abs(+first.longitude - cornerBound0[1])
      const firstToLong1 = Math.abs(+first.longitude - cornerBound1[1])
      const firstToLat0 = Math.abs(+first.latitude - cornerBound0[0])
      const firstToLat1 = Math.abs(+first.latitude - cornerBound1[0])

      if (firstToLong0 > firstToLong1) cornerBound1[1] = +first.longitude + firstToLong0
      if (firstToLong0 < firstToLong1) cornerBound0[1] = +first.longitude - firstToLong1
      if (firstToLat0 > firstToLat1) cornerBound1[0] = +first.latitude + firstToLat0
      if (firstToLat0 < firstToLat1) cornerBound0[0] = +first.latitude - firstToLat1
    }

    // Add some buffer on both sides of the time extent
    minTime = minTime - Math.abs((maxTime - minTime) / 10)
    maxTime = maxTime + Math.abs((maxTime - minTime) / 10)
  }
  return {
    ...appState,
    associations: {
      ...appState.associations,
      narrative: action.narrative
    },
    map: {
      ...appState.map,
      bounds: (action.narrative) ? [cornerBound0, cornerBound1] : null
    },
    timeline: {
      ...appState.timeline,
      range: [minTime, maxTime]
    }
  }
}

function updateNarrativeStepIdx (appState, action) {
  return {
    ...appState,
    narrativeState: {
      current: action.idx
    }
  }
}

function toggleAssociations (appState, action) {
  if (!(action.value instanceof Array)) {
    action.value = [action.value]
  }
  const { association: associationType } = action

  let newAssociations = appState.associations[associationType].slice(0)
  action.value.forEach(vl => {
    if (newAssociations.includes(vl)) {
      newAssociations = newAssociations.filter(s => s !== vl)
    } else {
      newAssociations.push(vl)
    }
  })

  return {
    ...appState,
    associations: {
      ...appState.associations,
      [associationType]: newAssociations
    }
  }
}

function clearFilter (appState, action) {
  return {
    ...appState,
    filters: {
      ...appState.filters,
      [action.filter]: []
    }
  }
}

function updateTimeRange (appState, action) { // XXX
  return {
    ...appState,
    timeline: {
      ...appState.timeline,
      range: action.timerange
    }
  }
}

function updateDimensions (appState, action) {
  return {
    ...appState,
    timeline: {
      ...appState.timeline,
      dimensions: {
        ...appState.timeline.dimensions,
        ...action.dims
      }
    }
  }
}

function toggleLanguage (appState, action) {
  let otherLanguage = (appState.language === 'es-MX') ? 'en-US' : 'es-MX'
  return Object.assign({}, appState, {
    language: action.language || otherLanguage
  })
}

function updateSource (appState, action) {
  return {
    ...appState,
    source: action.source
  }
}

function fetchError (state, action) {
  return {
    ...state,
    error: action.message,
    notifications: [{ type: 'error', message: action.message }]
  }
}

const toggleSites = toggleFlagAC('isShowingSites')
const toggleFetchingDomain = toggleFlagAC('isFetchingDomain')
const toggleFetchingSources = toggleFlagAC('isFetchingSources')
const toggleInfoPopup = toggleFlagAC('isInfopopup')
const toggleIntroPopup = toggleFlagAC('isIntropopup')
const toggleNotifications = toggleFlagAC('isNotification')
const toggleCover = toggleFlagAC('isCover')

function fetchSourceError (appState, action) {
  return {
    ...appState,
    errors: {
      ...appState.errors,
      source: action.msg
    }
  }
}

function setLoading (appState) {
  return {
    ...appState,
    loading: true
  }
}

function setNotLoading (appState) {
  return {
    ...appState,
    loading: false
  }
}

function setInitialCategories (appState, action) {
  const categories = action.values.reduce((acc, val) => {
    if (val.mode === ASSOCIATION_MODES.CATEGORY) acc.push(val.id)
    return acc
  }, [])

  return {
    ...appState,
    associations: {
      ...appState.associations,
      categories: categories
    }
  }
}

function updateSearchQuery (appState, action) {
  return {
    ...appState,
    searchQuery: action.searchQuery
  }
}

function app (appState = initial.app, action) {
  switch (action.type) {
    case UPDATE_HIGHLIGHTED:
      return updateHighlighted(appState, action)
    case UPDATE_SELECTED:
      return updateSelected(appState, action)
    case UPDATE_COLORING_SET:
      return updateColoringSet(appState, action)
    case CLEAR_FILTER:
      return clearFilter(appState, action)
    case TOGGLE_ASSOCIATIONS:
      return toggleAssociations(appState, action)
    case UPDATE_TIMERANGE:
      return updateTimeRange(appState, action)
    case UPDATE_DIMENSIONS:
      return updateDimensions(appState, action)
    case UPDATE_NARRATIVE:
      return updateNarrative(appState, action)
    case UPDATE_NARRATIVE_STEP_IDX:
      return updateNarrativeStepIdx(appState, action)
    case UPDATE_SOURCE:
      return updateSource(appState, action)
    /* toggles */
    case TOGGLE_LANGUAGE:
      return toggleLanguage(appState, action)
    case TOGGLE_SITES:
      return toggleSites(appState)
    case TOGGLE_FETCHING_DOMAIN:
      return toggleFetchingDomain(appState)
    case TOGGLE_FETCHING_SOURCES:
      return toggleFetchingSources(appState)
    case TOGGLE_INFOPOPUP:
      return toggleInfoPopup(appState)
    case TOGGLE_INTROPOPUP:
      return toggleIntroPopup(appState)
    case TOGGLE_NOTIFICATIONS:
      return toggleNotifications(appState)
    case TOGGLE_COVER:
      return toggleCover(appState)
    /* errors */
    case FETCH_ERROR:
      return fetchError(appState, action)
    case FETCH_SOURCE_ERROR:
      return fetchSourceError(appState, action)
    case SET_LOADING:
      return setLoading(appState)
    case SET_NOT_LOADING:
      return setNotLoading(appState)
    case SET_INITIAL_CATEGORIES:
      return setInitialCategories(appState, action)
    case UPDATE_SEARCH_QUERY:
      return updateSearchQuery(appState, action)
    default:
      return appState
  }
}

export default app
