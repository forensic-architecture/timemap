import Joi from 'joi';

import eventSchema from '../schema/eventSchema.js';
import categorySchema from '../schema/categorySchema.js';
import siteSchema from '../schema/siteSchema.js';

import { capitalize } from './helpers.js';

/*
* Create an error notification object
* Types: ['error', 'warning', 'good', 'neural']
*/
function makeError(type, id, message) {
  return {
    type: 'error',
    id,
    message: `${type} ${id}: ${message}`
  }
}

/*
* Validate domain schema
*/
export function validate(domain) {
  const sanitizedDomain = {
    events: [],
    categories: [],
    sites: [],
    notifications: domain.notifications,
    tags: domain.tags
  }

  const discardedDomain = {
    events: [],
    categories: [],
    sites: []
  }

  function validateItem(item, domainClass, schema) {
    const result = Joi.validate(item, schema);
    if (result.error !== null) {
      const id = item.id || '-';
      const domainStr = capitalize(domainClass);
      const error = makeError(domainStr, id, result.error.message);

      discardedDomain[domainClass].push(Object.assign(item, { error }));
    } else {
      sanitizedDomain[domainClass].push(item);
    }
  }

  domain.events.forEach(event => {
    validateItem(event, 'events', eventSchema);
  });
  domain.categories.forEach(category => {
    validateItem(category, 'categories', categorySchema);
  });
  domain.sites.forEach(site => {
    validateItem(site, 'sites', siteSchema);
  });

  // Message the number of failed items
  Object.keys(discardedDomain).forEach(disc => {
    const len = discardedDomain[disc].length;
    if (len) {
      sanitizedDomain.notifications.push({
        message: `${len} invalid ${disc} not displayed.`,
        items: discardedDomain[disc],
        type: 'error'
      });
    }
  })

  return sanitizedDomain;
}
