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

const isLeaf = node => (Object.keys(node.children).length === 0)
const isDuplicate = (node, set) => { return (set.has(node.key)) }

/*
* Traverse a filter tree and check its duplicates
*/
function validateTree (node, parent, set, duplicates, parentCount) {
  if (!(typeof (node.children) === 'object')) {
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
    parentCount[0] = parentCount[0] + 1
    // If it's not a leaf, simply keep going
    Object.values(node.children).forEach((childNode) => {
      validateTree(childNode, node, set, duplicates, parentCount)
    })
  }
}

/*
* Validate domain schema
*/
export function validateDomain (domain) {
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

  // Validate uniqueness of filters and count
  const filterSet = new Set([])
  const duplicateFilters = []
  // in a list so that it can be modified.
  // starts at -1 because the top layer can't be folded
  const foldCount = [-1]
  validateTree(domain.filters, {}, filterSet, duplicateFilters, foldCount)

  // Duplicated filters
  if (duplicateFilters.length > 0) {
    sanitizedDomain.notifications.push({
      message: `Filters are required to be unique. Ignoring duplicates for now.`,
      items: duplicateFilters,
      type: 'error'
    })
  }
  sanitizedDomain.filters = domain.filters
  sanitizedDomain.filterFoldCount = foldCount[0]

  // append events with datetime and sort
  sanitizedDomain.events.forEach((event, idx) => {
    event.id = idx
    event.datetime = calcDatetime(event.date, event.time)
  })

  sanitizedDomain.events.sort((a, b) => a.datetime - b.datetime)

  return sanitizedDomain
}
