import initial from '../store/initial.js';

import {
  UPDATE_DOMAIN,
} from '../actions';

import { parseDateTimes } from './utils/helpers.js';
import { validate } from './utils/validators.js';

function updateDomain(domainState, action) {
  action.domain.events = parseDateTimes(action.domain.events);

  return Object.assign({}, domainState, validate(action.domain));
}

function domain(domainState = initial.domain, action) {
  switch (action.type) {
    case UPDATE_DOMAIN:
      return updateDomain(domainState, action);
    default:
      return domainState;
  }
}

export default domain;
