import initial from '../store/initial.js'

import {
  UPDATE_HIGHLIGHTED,
  UPDATE_SELECTED,
  UPDATE_TAGFILTERS,
  UPDATE_CATEGORYFILTERS,
  UPDATE_TIMERANGE,
  UPDATE_NARRATIVE,
  INCREMENT_NARRATIVE_CURRENT,
  DECREMENT_NARRATIVE_CURRENT,
  UPDATE_SOURCE,
  RESET_ALLFILTERS,
  TOGGLE_LANGUAGE,
  TOGGLE_MAPVIEW,
  TOGGLE_SITES,
  TOGGLE_FETCHING_DOMAIN,
  TOGGLE_FETCHING_SOURCES,
  TOGGLE_INFOPOPUP,
  TOGGLE_NOTIFICATIONS,
  FETCH_ERROR,
  FETCH_SOURCE_ERROR,
} from '../actions'

function updateHighlighted(appState, action) {
  return Object.assign({}, appState, {
    highlighted: action.highlighted
  })
}

function updateSelected(appState, action) {
  return Object.assign({}, appState, {
    selected: action.selected
  })
}

function updateNarrative(appState, action) {
  let minTime = appState.filters.timerange[0];
  let maxTime = appState.filters.timerange[1];

  let cornerBound0 = [180, 180];
  let cornerBound1 = [-180, -180];

  // Compute narrative time range and map bounds
  if (!!action.narrative) {
    minTime = parseDate('2100-01-01T00:00:00');
    maxTime = parseDate('1900-01-01T00:00:00');

    // Find max and mins coordinates of narrative events
    action.narrative.steps.forEach(step => {
      const stepTime = parseDate(step.timestamp);
      if (stepTime < minTime) minTime = stepTime;
      if (stepTime > maxTime) maxTime = stepTime;

      if (!!step.longitude && !!step.latitude) {
        if (+step.longitude < cornerBound0[1]) cornerBound0[1] = +step.longitude;
        if (+step.longitude > cornerBound1[1]) cornerBound1[1] = +step.longitude;
        if (+step.latitude < cornerBound0[0]) cornerBound0[0] = +step.latitude;
        if (+step.latitude > cornerBound1[0]) cornerBound1[0] = +step.latitude;  
      }
    });
    // Adjust bounds to center around first event, while keeping visible all others
    // Takes first event, finds max ditance with first attempt bounds, and use this max distance
    // on the other side, both in latitude and longitude
    const first = action.narrative.steps[0];
    if (!!first.longitude && !!first.latitude) {
      const firstToLong0 = Math.abs(+first.longitude - cornerBound0[1]);
      const firstToLong1 = Math.abs(+first.longitude - cornerBound1[1]);
      const firstToLat0 = Math.abs(+first.latitude - cornerBound0[0]);
      const firstToLat1 = Math.abs(+first.latitude - cornerBound1[0]);

      if (firstToLong0 > firstToLong1) cornerBound1[1] = +first.longitude + firstToLong0;
      if (firstToLong0 < firstToLong1) cornerBound0[1] = +first.longitude - firstToLong1;
      if (firstToLat0 > firstToLat1) cornerBound1[0] = +first.latitude + firstToLat0;
      if (firstToLat0 < firstToLat1) cornerBound0[0] = +first.latitude - firstToLat1;
    }
    
    // Add some buffer on both sides of the time extent
    minTime = new Date(minTime.getTime() - Math.abs((maxTime - minTime) / 10));
    maxTime = new Date(maxTime.getTime() + Math.abs((maxTime - minTime) / 10));
  }

  return {
    ...appState,
    narrative: action.narrative,
    narrativeState: {
      current: !!action.narrative ? 0 : null
    },
    filters: {
      ...appState.filters,
      timerange: [minTime, maxTime],
      mapBounds: (action.narrative) ? [cornerBound0, cornerBound1] : null
    }
  }
}

function incrementNarrativeCurrent(appState, action) {
  return {
    ...appState,
    narrativeState: {
      current: appState.narrativeState.current += 1
    }
  }
}

function decrementNarrativeCurrent(appState, action) {
  return {
    ...appState,
    narrativeState: {
      current: appState.narrativeState.current -= 1
    }
  }
}

function updateTagFilters(appState, action) {
  const tagFilters = appState.filters.tags.slice(0)
  const nextActiveState = action.tag.active

  function traverseNode(node) {
    const tagFilter = tagFilters.find(tF => tF.key === node.key)
    node.active = nextActiveState
    if (!tagFilter) tagFilters.push(node)

    if (node && Object.keys(node.children).length > 0) {
      Object.values(node.children).forEach((childNode) => { traverseNode(childNode) })
    }
  }

  traverseNode(action.tag)

  return Object.assign({}, appState, {
    filters: Object.assign({}, appState.filters, {
      tags: tagFilters
    })
  })
}

function updateCategoryFilters(appState, action) {
  const categoryFilters = appState.filters.categories.slice(0)

  const catFilter = categoryFilters.find(cF => cF.category === action.category.category);

  if (!catFilter) {
    categoryFilters.push(action.category)
  } else {
    catFilter.active = (!!action.category.active);
  }
  

  return Object.assign({}, appState, {
    filters: Object.assign({}, appState.filters, {
      categories: categoryFilters
    })
  })
}

function updateTimeRange(appState, action) { // XXX
  return Object.assign({}, appState, {
    filters: Object.assign({}, appState.filters, {
      timerange: action.timerange
    }),
  })
}

function resetAllFilters(appState) { // XXX
  return Object.assign({}, appState, {
    filters: Object.assign({}, appState.filters, {
      tags: [],
      categories: [],
      timerange: [
        d3.timeParse("%Y-%m-%dT%H:%M:%S")("2014-09-25T12:00:00"),
        d3.timeParse("%Y-%m-%dT%H:%M:%S")("2014-09-28T12:00:00")
      ],
    }),
    selected: [],
  })
}

function toggleLanguage(appState, action) {
  let otherLanguage = (appState.language === 'es-MX') ? 'en-US' : 'es-MX'
  return Object.assign({}, appState, {
    language: action.language || otherLanguage
  })
}

function toggleMapView(appState, action) {
  const isLayerInView = !appState.views[layer]
  const newViews = {}
  newViews[layer] = isLayerInView
  const views = Object.assign({}, appState.views, newViews)
  return Object.assign({}, appState, {
    filters: Object.assign({}, appState.filters, {
      views
    })
  })
}

function toggleSites(appState, action) {
  return {
    ...appState,
    flags: {
      ...appState.flags,
      isShowingSites: !appState.flags.isShowingSites
    }
  }
}

function updateSource(appState, action) {
  return {
    ...appState,
    source: action.source
  }
}

function fetchError(state, action) {
  return {
    ...state,
    error: action.message,
    notifications: [{ type: 'error', message: action.message }]
  }
}

function toggleFetchingDomain(appState, action) {
  return Object.assign({}, appState, {
    flags: Object.assign({}, appState.flags, {
      isFetchingDomain: !appState.flags.isFetchingDomain
    })
  })
}

function toggleFetchingSources(appState, action) {
  return Object.assign({}, appState, {
    flags: Object.assign({}, appState.flags, {
      isFetchingSources: !appState.flags.isFetchingSources
    })
  })
}

function toggleInfoPopup(appState, action) {
  return Object.assign({}, appState, {
    flags: Object.assign({}, appState.flags, {
      isInfopopup: !appState.flags.isInfopopup
    })
  })
}

function toggleNotifications(appState, action) {
  return Object.assign({}, appState, {
    flags: Object.assign({}, appState.flags, {
      isNotification: !appState.flags.isNotification
    })
  })
}

function fetchSourceError(appState, action) {
  return {
    ...appState,
    errors: {
      ...appState.errors,
      source: action.msg
    }
  }
}



function app(appState = initial.app, action) {
  switch (action.type) {
    case UPDATE_HIGHLIGHTED:
      return updateHighlighted(appState, action)
    case UPDATE_SELECTED:
      return updateSelected(appState, action)
    case UPDATE_TAGFILTERS:
      return updateTagFilters(appState, action)
    case UPDATE_CATEGORYFILTERS:
      return updateCategoryFilters(appState, action)
    case UPDATE_TIMERANGE:
      return updateTimeRange(appState, action)
    case UPDATE_NARRATIVE:
      return updateNarrative(appState, action)
    case INCREMENT_NARRATIVE_CURRENT:
      return incrementNarrativeCurrent(appState, action)
    case DECREMENT_NARRATIVE_CURRENT:
      return decrementNarrativeCurrent(appState, action)
    case UPDATE_SOURCE:
      return updateSource(appState, action)
    case RESET_ALLFILTERS:
      return resetAllFilters(appState, action)
    case TOGGLE_LANGUAGE:
      return toggleLanguage(appState, action)
    case TOGGLE_MAPVIEW:
      return toggleMapView(appState, action)
    case TOGGLE_SITES:
      return toggleSites(appState, action)
    case FETCH_ERROR:
      return fetchError(appState, action)
    case TOGGLE_FETCHING_DOMAIN:
      return toggleFetchingDomain(appState, action)
    case TOGGLE_FETCHING_SOURCES:
      return toggleFetchingSources(appState, action)
    case TOGGLE_INFOPOPUP:
      return toggleInfoPopup(appState, action)
    case TOGGLE_NOTIFICATIONS:
      return toggleNotifications(appState, action)
    case FETCH_SOURCE_ERROR:
      return fetchSourceError(appState, action)
    default:
      return appState
  }
}

export default app
