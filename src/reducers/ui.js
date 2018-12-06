import initial from '../store/initial.js';

import {
  TOGGLE_FETCHING_DOMAIN,
  TOGGLE_FETCHING_SOURCES,
  TOGGLE_VIEW,
  TOGGLE_TIMELINE,
  TOGGLE_INFOPOPUP,
  TOGGLE_NOTIFICATIONS
} from '../actions'

function toggleFetchingDomain(uiState, action) {
  return {
    ...uiState,
    flags: {
      ...uiState.flags,
      isFetchingDomain: !uiState.flags.isFetchingDomain
    }
  }
}

function toggleFetchingSources(uiState, action) {
  return {
    ...uiState,
    flags: {
      ...uiState.flags,
      isFetchingSources: !uiState.flags.isFetchingSources
    }
  }
}

function toggleInfoPopup(uiState, action) {
  return {
    ...uiState,
    flags: {
      ...uiState.flags,
      isInfopopup: !uiState.flags.isInfopopup
    }
  }
}

function ui(uiState = initial.ui, action) {
  switch (action.type) {
    case TOGGLE_FETCHING_DOMAIN:
      return toggleFetchingDomain(uiState, action)
    case TOGGLE_FETCHING_SOURCES:
      return toggleFetchingSources(uiState, action)
    case TOGGLE_INFOPOPUP:
      return toggleInfoPopup(uiState, action)
    default:
      return uiState
  }
}

export default ui;
