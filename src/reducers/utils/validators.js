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


const isLeaf = node => (Object.keys(node.children).length === 0);
const isDuplicate = (node, set) => { return (set.has(node.key)); };


/*
* Traverse a tag tree and check its duplicates
*/
function validateTree(node, parent, set, duplicates) {
  // If it's a leaf, check that it's not duplicate
  if (isLeaf(node)) {
    if (isDuplicate(node, set)) {
      duplicates.push({
        id: node.key,
        error: makeError('Tags', node.key, 'tag was found more than once in hierarchy. Ignoring duplicate.')
      });
      delete parent.children[node.key];
    } else {
      set.add(node.key);
    }
  } else {
    // If it's not a leaf, simply keep going
    Object.values(node.children).forEach((childNode) => {
      validateTree(childNode, node, set, duplicates);
    });
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
    tags: {}
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

  // Message the number of failed items in domain
  Object.keys(discardedDomain).forEach(disc => {
    const len = discardedDomain[disc].length;
    if (len) {
      sanitizedDomain.notifications.push({
        message: `${len} invalid ${disc} not displayed.`,
        items: discardedDomain[disc],
        type: 'error'
      });
    }
  });

  // Validate uniqueness of tags
  const tagSet = new Set([]);
  const duplicateTags = [];
  validateTree(domain.tags, {}, tagSet, duplicateTags);

  // Duplicated tags
  if (duplicateTags.length > 0) {
    sanitizedDomain.notifications.push({
      message: `Tags are required to be unique. Ignoring duplicates for now.`,
      items: duplicateTags,
      type: 'error'
    });
  }
  sanitizedDomain.tags = domain.tags;

  return sanitizedDomain;
}
