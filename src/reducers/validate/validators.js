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
* Traverse a tag tree and check its duplicates
*/
function validateTree (node, parent, set, duplicates) {
  if (!Array.isArray(node) || !node.length) {
    return
  }
  // If it's a leaf, check that it's not duplicate
  if (isLeaf(node)) {
    if (isDuplicate(node, set)) {
      duplicates.push({
        id: node.key,
        error: makeError('Tags', node.key, 'tag was found more than once in hierarchy. Ignoring duplicate.')
      })
      delete parent.children[node.key]
    } else {
      set.add(node.key)
    }
  } else {
    // If it's not a leaf, simply keep going
    Object.values(node.children).forEach((childNode) => {
      validateTree(childNode, node, set, duplicates)
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
    tags: {},
    shapes: [],
    notifications: domain.notifications
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

  // Validate uniqueness of tags
  const tagSet = new Set([])
  const duplicateTags = []
  validateTree(domain.tags, {}, tagSet, duplicateTags)

  // Duplicated tags
  if (duplicateTags.length > 0) {
    sanitizedDomain.notifications.push({
      message: `Tags are required to be unique. Ignoring duplicates for now.`,
      items: duplicateTags,
      type: 'error'
    })
  }
  sanitizedDomain.tags = domain.tags

  // append events with datetime and sort
  sanitizedDomain.events.forEach(event => {
    event.datetime = calcDatetime(event.date, event.time)
  })

  sanitizedDomain.events.sort((a, b) => a.datetime - b.datetime)

  return sanitizedDomain
}
