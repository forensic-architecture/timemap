import initial from '../store/initial.js';

import {
  UPDATE_HIGHLIGHTED,
  UPDATE_SELECTED,
  UPDATE_TAGFILTERS,
  UPDATE_TIMERANGE,
  RESET_ALLFILTERS,
  TOGGLE_LANGUAGE,
  FETCH_ERROR,
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

function fetchError(state, action) {
  return {
    ...state,
    error: action.message,
    notifications: [{ type: 'error', message: action.message }]
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
    case RESET_ALLFILTERS:
      return resetAllFilters(appState, action);
    case TOGGLE_LANGUAGE:
      return toggleLanguage(appState, action);
    case FETCH_ERROR:
      return fetchError(appState, action);
    default:
      return appState;
  }
}

export default app;
