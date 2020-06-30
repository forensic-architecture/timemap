import Joi from 'joi'

import eventSchema from './eventSchema'
import categorySchema from './categorySchema'
import siteSchema from './siteSchema'
import narrativeSchema from './narrativeSchema'
import sourceSchema from './sourceSchema'
import shapeSchema from './shapeSchema'

import { calcDatetime, capitalize } from '../../common/utilities'

/*
* Create an error notification object
* Types: ['error', 'warning', 'good', 'neural']
*/
function makeError (type, id, message) {
  return {
    type: 'error',
    id,
    message: `${type} ${id}: ${message}`
  }
}

function isValidDate (d) {
  return d instanceof Date && !isNaN(d)
}

const isLeaf = node => (Object.keys(node.children).length === 0)
const isDuplicate = (node, set) => { return (set.has(node.key)) }

/*
* Traverse a filter tree and check its duplicates. Also recompose as
* description if `features.USE_FILTER_DESCRIPTIONS` is true.
*/
function validateFilterTree (node, parent, set, duplicates, hasFilterDescriptions) {
  if (hasFilterDescriptions) {
    if (node.key === '_root') {
      node.isDescription = true // setting first set of nodes to values
    } else if (!parent.isDescription) {
      node.isDescription = true
    } else {
      node.isDescription = false
    }

    if (node.isDescription && node.key !== 'root') {
      parent.description = node.key
      parent.children = node.children
      delete parent.isDescription
    }
    if (isLeaf(node)) {
      delete parent.isDescription
    }
  }

  if (typeof (node) !== 'object' || typeof (node.children) !== 'object') {
    return
  }
  // If it's a leaf, check that it's not duplicate
  if (isLeaf(node)) {
    if (isDuplicate(node, set)) {
      duplicates.push({
        id: node.key,
        error: makeError('Filters', node.key, 'filter was found more than once in hierarchy. Ignoring duplicate.')
      })
      delete parent.children[node.key]
    } else {
      set.add(node.key)
    }
  } else {
    // If it's not a leaf, simply keep going
    Object.values(node.children).forEach((childNode) => {
      validateFilterTree(childNode, node, set, duplicates, hasFilterDescriptions)
    })
  }
}

/*
* Validate domain schema
*/
export function validateDomain (domain, features) {
  const sanitizedDomain = {
    events: [],
    categories: [],
    sites: [],
    narratives: [],
    sources: {},
    filters: {},
    shapes: [],
    notifications: domain ? domain.notifications : null
  }

  if (domain === undefined) {
    return sanitizedDomain
  }

  const discardedDomain = {
    events: [],
    categories: [],
    sites: [],
    narratives: [],
    sources: [],
    shapes: []
  }

  function validateArrayItem (item, domainKey, schema) {
    const result = Joi.validate(item, schema)
    if (result.error !== null) {
      const id = item.id || '-'
      const domainStr = capitalize(domainKey)
      const error = makeError(domainStr, id, result.error.message)

      discardedDomain[domainKey].push(Object.assign(item, { error }))
    } else {
      sanitizedDomain[domainKey].push(item)
    }
  }

  function validateArray (items, domainKey, schema) {
    items.forEach(item => {
      // NB: backwards compatibility with 'tags' for 'filters'
      if (domainKey === 'events') {
        if (!item.filters && !!item.tags) {
          item.filters = item.tags
        }
      }
      validateArrayItem(item, domainKey, schema)
    })
  }

  function validateObject (obj, domainKey, itemSchema) {
    Object.keys(obj).forEach(key => {
      const vl = obj[key]
      const result = Joi.validate(vl, itemSchema)
      if (result.error !== null) {
        const id = vl.id || '-'
        const domainStr = capitalize(domainKey)
        discardedDomain[domainKey].push({
          ...vl,
          error: makeError(domainStr, id, result.error.message)
        })
      } else {
        sanitizedDomain[domainKey][key] = vl
      }
    })
  }

  validateArray(domain.events, 'events', eventSchema)
  validateArray(domain.categories, 'categories', categorySchema)
  validateArray(domain.sites, 'sites', siteSchema)
  validateArray(domain.narratives, 'narratives', narrativeSchema)
  validateObject(domain.sources, 'sources', sourceSchema)
  validateObject(domain.shapes, 'shapes', shapeSchema)

  // NB: [lat, lon] array is best format for projecting into map
  sanitizedDomain.shapes = sanitizedDomain.shapes.map(shape => ({
    name: shape.name,
    points: shape.items.map(coords => (
      coords.replace(/\s/g, '').split(',')
    ))
  })
  )

  // Validate uniqueness of filters
  const filterSet = new Set([])
  const duplicateFilters = []
  validateFilterTree(domain.filters, {}, filterSet, duplicateFilters, features.USE_FILTER_DESCRIPTIONS)

  // Duplicated filters
  if (duplicateFilters.length > 0) {
    sanitizedDomain.notifications.push({
      message: `Filters are required to be unique. Ignoring duplicates for now.`,
      items: duplicateFilters,
      type: 'error'
    })
  }
  sanitizedDomain.filters = domain.filters

  // append events with datetime and sort
  sanitizedDomain.events = sanitizedDomain.events.filter((event, idx) => {
    event.id = idx
    event.datetime = calcDatetime(event.date, event.time)
    if (!isValidDate(event.datetime)) {
      discardedDomain['events'].push({ ...event, error: makeError('events', event.id, `Invalid date. It's been dropped, as otherwise timemap won't work as expected.`) })
      return false
    }
    return true
  })

  sanitizedDomain.events.sort((a, b) => a.datetime - b.datetime)

  // Message the number of failed items in domain
  Object.keys(discardedDomain).forEach(disc => {
    const len = discardedDomain[disc].length
    if (len) {
      sanitizedDomain.notifications.push({
        message: `${len} invalid ${disc} not displayed.`,
        items: discardedDomain[disc],
        type: 'error'
      })
    }
  })

  return sanitizedDomain
}
