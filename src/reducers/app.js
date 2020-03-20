import initial from '../store/initial.js'
import { parseDate, toggleFlagAC } from '../common/utilities'

import {
  UPDATE_HIGHLIGHTED,
  UPDATE_SELECTED,
  CLEAR_FILTER,
  TOGGLE_FILTER,
  UPDATE_TIMERANGE,
  UPDATE_DIMENSIONS,
  UPDATE_NARRATIVE,
  INCREMENT_NARRATIVE_CURRENT,
  DECREMENT_NARRATIVE_CURRENT,
  UPDATE_SOURCE,
  TOGGLE_LANGUAGE,
  TOGGLE_SITES,
  TOGGLE_FETCHING_DOMAIN,
  TOGGLE_FETCHING_SOURCES,
  TOGGLE_INFOPOPUP,
  TOGGLE_NOTIFICATIONS,
  TOGGLE_COVER,
  FETCH_ERROR,
  FETCH_SOURCE_ERROR
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

function updateNarrative (appState, action) {
  let minTime = appState.timeline.range[0]
  let maxTime = appState.timeline.range[1]

  let cornerBound0 = [180, 180]
  let cornerBound1 = [-180, -180]

  // Compute narrative time range and map bounds
  if (action.narrative) {
    minTime = parseDate('2100-01-01T00:00:00')
    maxTime = parseDate('1900-01-01T00:00:00')

    // Find max and mins coordinates of narrative events
    action.narrative.steps.forEach(step => {
      const stepTime = parseDate(step.timestamp)
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
    minTime = new Date(minTime.getTime() - Math.abs((maxTime - minTime) / 10))
    maxTime = new Date(maxTime.getTime() + Math.abs((maxTime - minTime) / 10))
  }

  return {
    ...appState,
    narrative: action.narrative,
    narrativeState: {
      current: action.narrative ? 0 : null
    },
    filters: {
      ...appState.filters,
      timerange: [minTime, maxTime],
      mapBounds: (action.narrative) ? [cornerBound0, cornerBound1] : null
    }
  }
}

function incrementNarrativeCurrent (appState, action) {
  appState.narrativeState.current += 1

  return {
    ...appState,
    narrativeState: {
      current: appState.narrativeState.current
    }
  }
}

function decrementNarrativeCurrent (appState, action) {
  appState.narrativeState.current -= 1

  return {
    ...appState,
    narrativeState: {
      current: appState.narrativeState.current
    }
  }
}

function toggleFilter (appState, action) {
  let newTags = appState.filters[action.filter].slice(0)
  if (newTags.includes(action.value)) {
    newTags = newTags.filter(s => s !== action.value)
  } else {
    newTags.push(action.value)
  }
  return {
    ...appState,
    filters: {
      ...appState.filters,
      [action.filter]: newTags
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

function app (appState = initial.app, action) {
  switch (action.type) {
    case UPDATE_HIGHLIGHTED:
      return updateHighlighted(appState, action)
    case UPDATE_SELECTED:
      return updateSelected(appState, action)
    case CLEAR_FILTER:
      return clearFilter(appState, action)
    case TOGGLE_FILTER:
      return toggleFilter(appState, action)
    case UPDATE_TIMERANGE:
      return updateTimeRange(appState, action)
    case UPDATE_DIMENSIONS:
      return updateDimensions(appState, action)
    case UPDATE_NARRATIVE:
      return updateNarrative(appState, action)
    case INCREMENT_NARRATIVE_CURRENT:
      return incrementNarrativeCurrent(appState, action)
    case DECREMENT_NARRATIVE_CURRENT:
      return decrementNarrativeCurrent(appState, action)
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
    case TOGGLE_NOTIFICATIONS:
      return toggleNotifications(appState)
    case TOGGLE_COVER:
      return toggleCover(appState)
    /* errors */
    case FETCH_ERROR:
      return fetchError(appState, action)
    case FETCH_SOURCE_ERROR:
      return fetchSourceError(appState, action)
    default:
      return appState
  }
}

export default app
