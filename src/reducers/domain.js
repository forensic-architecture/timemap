import initial from '../store/initial.js'

import { UPDATE_DOMAIN, MARK_NOTIFICATIONS_READ } from '../actions'
import { parseDateTimes } from './utils/helpers.js'
import { validateDomain } from './utils/validators.js'

function updateDomain (domainState, action) {
  action.domain.events = parseDateTimes(action.domain.events)

  // return Object.assign({}, domainState, validate(action.domain))
  return {
    ...domainState,
    ...validateDomain(action.domain)
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
