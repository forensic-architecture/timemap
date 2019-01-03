import initial from '../store/initial.js';

import { parseDate } from '../js/utilities.js';

import {
  UPDATE_HIGHLIGHTED,
  UPDATE_SELECTED,
  UPDATE_TAGFILTERS,
  UPDATE_TIMERANGE,
  UPDATE_NARRATIVE,
  UPDATE_SOURCE,
  RESET_ALLFILTERS,
  TOGGLE_LANGUAGE,
  TOGGLE_MAPVIEW,
  TOGGLE_FETCHING_DOMAIN,
  TOGGLE_FETCHING_SOURCES,
  TOGGLE_INFOPOPUP,
  TOGGLE_NOTIFICATIONS,
  FETCH_ERROR,
  FETCH_SOURCE_ERROR,
} from '../actions';

function updateHighlighted(appState, action) {
  return Object.assign({}, appState, {
    highlighted: action.highlighted
  });
}

function updateSelected(appState, action) {
  return Object.assign({}, appState, {
    selected: action.selected
  });
}

function updateNarrative(appState, action) {
  return {
    ...appState,
    narrative: action.narrative,
    narrativeState: {
      current: 0
    }
  }
}

function updateTagFilters(appState, action) {
  const tagFilters = appState.filters.tags.slice(0);
  const nextActiveState = action.tag.active

  function traverseNode(node) {
    const tagFilter = tagFilters.find(tF => tF.key === node.key);
    node.active = nextActiveState;
    if (!tagFilter) tagFilters.push(node);

    if (node && Object.keys(node.children).length > 0) {
      Object.values(node.children).forEach((childNode) => { traverseNode(childNode); });
    }
  }

  traverseNode(action.tag);

  return Object.assign({}, appState, {
    filters: Object.assign({}, appState.filters, {
      tags: tagFilters
    })
  });
}

function updateTimeRange(appState, action) { // XXX
  return Object.assign({}, appState, {
    filters: Object.assign({}, appState.filters, {
      timerange: action.timerange
    }),
  });
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
  });
}

function toggleLanguage(appState, action) {
  let otherLanguage = (appState.language === 'es-MX') ? 'en-US' : 'es-MX';
  return Object.assign({}, appState, {
    language: action.language || otherLanguage
  });
}

function toggleMapView(appState, action) {
  const isLayerInView = !appState.views[layer];
  const newViews = {};
  newViews[layer] = isLayerInView;
  const views = Object.assign({}, appState.views, newViews);
  return Object.assign({}, appState, {
    filters: Object.assign({}, appState.filters, {
      views
    })
  });
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
  });
}

function toggleFetchingSources(appState, action) {
  return Object.assign({}, appState, {
    flags: Object.assign({}, appState.flags, {
      isFetchingSources: !appState.flags.isFetchingSources
    })
  });
}

function toggleInfoPopup(appState, action) {
  return Object.assign({}, appState, {
    flags: Object.assign({}, appState.flags, {
      isInfopopup: !appState.flags.isInfopopup
    })
  });
}

function toggleNotifications(appState, action) {
  return Object.assign({}, appState, {
    flags: Object.assign({}, appState.flags, {
      isNotification: !appState.flags.isNotification
    })
  });
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
      return updateHighlighted(appState, action);
    case UPDATE_SELECTED:
      return updateSelected(appState, action);
    case UPDATE_TAGFILTERS:
      return updateTagFilters(appState, action);
    case UPDATE_TIMERANGE:
      return updateTimeRange(appState, action);
    case UPDATE_NARRATIVE:
      return updateNarrative(appState, action);
    case UPDATE_SOURCE:
      return updateSource(appState, action);
    case RESET_ALLFILTERS:
      return resetAllFilters(appState, action);
    case TOGGLE_LANGUAGE:
      return toggleLanguage(appState, action);
    case TOGGLE_MAPVIEW:
      return toggleMapView(appState, action);
    case FETCH_ERROR:
      return fetchError(appState, action);
    case TOGGLE_FETCHING_DOMAIN:
      return toggleFetchingDomain(appState, action);
    case TOGGLE_FETCHING_SOURCES:
      return toggleFetchingSources(appState, action);
    case TOGGLE_INFOPOPUP:
      return toggleInfoPopup(appState, action);
    case TOGGLE_NOTIFICATIONS:
      return toggleNotifications(appState, action);
    case FETCH_SOURCE_ERROR:
      return fetchSourceError(appState, action);
    default:
      return appState;
  }
}

export default app;
