import initial from '../store/initial.js';

import {
  UPDATE_HIGHLIGHTED,
  UPDATE_SELECTED,
  UPDATE_FILTERS,
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

function updateFilters(appState, action) { // XXX
  return Object.assign({}, appState, {
    filters: Object.assign({}, appState.filters, action.filters)
  });
}

function updateTimeRange(appState, action) { // XXX
  return Object.assign({}, appState, {
    filters: Object.assign({}, appState.filters, action.range),
  });
}

function resetAllFilters(appState) { // XXX
  return Object.assign({}, appState, {
    filters: Object.assign({}, appState.filters, {
      tags: [],
      categories: [],
      range: [
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
    case UPDATE_FILTERS:
      return updateFilters(appState, action);
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
