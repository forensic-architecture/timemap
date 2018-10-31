import initial from '../store/initial.js';

import {
  TOGGLE_FETCHING_DOMAIN,
  TOGGLE_FETCHING_EVENTS,
  TOGGLE_VIEW,
  TOGGLE_TIMELINE,
  OPEN_CABINET,
  CLOSE_CABINET,
  TOGGLE_INFOPOPUP,
  TOGGLE_NOTIFICATIONS
} from '../actions'

function toggleFetchingDomain(uiState, action) {
  return Object.assign({}, uiState, {
    flags: Object.assign({}, uiState.flags, {
      isFetchingDomain: !uiState.flags.isFetchingDomain
    })
  });
}

function toggleFetchingEvents(uiState, action) {
  return Object.assign({}, uiState, {
    flags: Object.assign({}, uiState.flags, {
      isFetchingEvents: !uiState.flags.isFetchingEvents
    })
  });
}

function toggleView(uiState, action) {
  return Object.assign({}, uiState, {
    flags: Object.assign({}, uiState.flags, {
      isView2d: !uiState.flags.isView2d
    })
  });
}

function toggleTimeline(uiState, action) {
  return Object.assign({}, uiState, {
    flags: Object.assign({}, uiState.flags, {
      isTimeline: !uiState.flags.isTimeline
    })
  });
}

function closeCabinet(uiState, action) {
  return Object.assign({}, uiState, {
    flags: Object.assign({}, uiState.flags, {
      isCabinet: false
    })
  });
}

function openCabinet(uiState, action) {
  return Object.assign({}, uiState, {
    flags: Object.assign({}, uiState.flags, {
      isCabinet: true
    }),
    components: Object.assign({}, uiState.components, {
      cabinetFileTab: action.tabNum,
    })
  });
}

function toggleInfoPopup(uiState, action) {
  return Object.assign({}, uiState, {
    flags: Object.assign({}, uiState.flags, {
      isInfopopup: !uiState.flags.isInfopopup
    })
  });
}

function toggleNotifications(uiState, action) {
  return Object.assign({}, uiState, {
    flags: Object.assign({}, uiState.flags, {
      isNotification: !uiState.flags.isNotification
    })
  });
}

function ui(uiState = initial.ui, action) {
  switch (action.type) {
    case TOGGLE_FETCHING_DOMAIN:
      return toggleFetchingDomain(uiState, action);
    case TOGGLE_FETCHING_EVENTS:
      return toggleFetchingEvents(uiState, action);
    case TOGGLE_VIEW:
      return toggleView(uiState, action);
    case TOGGLE_TIMELINE:
      return toggleTimeline(uiState, action);
    case OPEN_CABINET:
      return openCabinet(uiState, action);
    case CLOSE_CABINET:
      return closeCabinet(uiState, action);
    case TOGGLE_INFOPOPUP:
      return toggleInfoPopup(uiState, action);
    case TOGGLE_NOTIFICATIONS:
      return toggleNotifications(uiState, action);
    default:
      return uiState;
  }
}

export default ui;
