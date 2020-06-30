import initial from '../store/initial.js'

import { UPDATE_DOMAIN, MARK_NOTIFICATIONS_READ } from '../actions'
import { validateDomain } from './validate/validators.js'

function updateDomain (domainState, action) {
  return {
    ...domainState,
    ...validateDomain(action.payload.domain, action.payload.features)
  }
}

function markNotificationsRead (domainState, action) {
  return {
    ...domainState,
    notifications: domainState.notifications.map(n => ({ ...n, isRead: true }))
  }
}

function domain (domainState = initial.domain, action) {
  switch (action.type) {
    case UPDATE_DOMAIN:
      return updateDomain(domainState, action)
    case MARK_NOTIFICATIONS_READ:
      return markNotificationsRead(domainState, action)
    default:
      return domainState
  }
}

export default domain
