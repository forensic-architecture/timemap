import Joi from 'joi'

import createEventSchema from './eventSchema'
import categorySchema from './categorySchema'
import siteSchema from './siteSchema'
import associationsSchema from './associationsSchema'
import sourceSchema from './sourceSchema'
import shapeSchema from './shapeSchema'

import { calcDatetime, capitalize, isFilterLeaf, isFilterDuplicate } from '../../common/utilities'

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

/*
* Traverse a filter tree and check its duplicates. Also recompose as
* description if `features.USE_ASSOCIATION_DESCRIPTIONS` is true.
*/
// function validateFilterTree (node, parent, set, duplicates, hasAssociationDescriptions) {
//   if (hasAssociationDescriptions) {
//     if (node.key === '_root') {
//       node.isDescription = true // setting first set of nodes to values
//     } else if (!parent.isDescription) {
//       node.isDescription = true
//     } else {
//       node.isDescription = false
//     }

//     if (node.isDescription && node.key !== 'root') {
//       parent.description = node.key
//       parent.children = node.children
//       delete parent.isDescription
//     }
//     if (isFilterLeaf(node)) {
//       delete parent.isDescription
//     }
//   }

//   if (typeof (node) !== 'object' || typeof (node.children) !== 'object') {
//     return
//   }
//   // If it's a leaf, check that it's not duplicate
//   if (isFilterLeaf(node)) {
//     if (isFilterDuplicate(node, set)) {
//       duplicates.push({
//         id: node.key,
//         error: makeError('Filters', node.key, 'filter was found more than once in hierarchy. Ignoring duplicate.')
//       })
//       delete parent.children[node.key]
//     } else {
//       set.add(node.key)
//     }
//   } else {
//     // If it's not a leaf, simply keep going
//     Object.values(node.children).forEach((childNode) => {
//       validateFilterTree(childNode, node, set, duplicates, hasAssociationDescriptions)
//     })
//   }
// }

function findDuplicateAssociations (associations) {
  const seenSet = new Set([])
  const duplicates = []
  associations.forEach(item => {
    if (seenSet.has(item.id)) {
      duplicates.push({
        id: item.id,
        error: makeError('Association', item.id, 'association was found more than once. Ignoring duplicate.')
      })
    } else {
      seenSet.add(item.id)
    }
  })
  return duplicates
}

/*
* Validate domain schema
*/
export function validateDomain (domain, features) {
  const sanitizedDomain = {
    events: [],
    categories: [],
    sites: [],
    associations: [],
    sources: {},
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
    associations: [],
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

  if (!Array.isArray(features.CUSTOM_EVENT_FIELDS)) {
    features.CUSTOM_EVENT_FIELDS = []
  }

  const eventSchema = createEventSchema(features.CUSTOM_EVENT_FIELDS)
  validateArray(domain.events, 'events', eventSchema)
  validateArray(domain.categories, 'categories', categorySchema)
  validateArray(domain.sites, 'sites', siteSchema)
  validateArray(domain.associations, 'associations', associationsSchema)
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

  // Validate uniqueness of associations
  // const associationSet = new Set([])
  // const duplicateAssociations = []
  // validateFilterTree(domain.associations, {}, associationSet, duplicateAssociations, features.USE_ASSOCIATION_DESCRIPTIONS)
  const duplicateAssociations = findDuplicateAssociations(domain.associations)
  // Duplicated associations
  if (duplicateAssociations.length > 0) {
    sanitizedDomain.notifications.push({
      message: `Associations are required to be unique. Ignoring duplicates for now.`,
      items: duplicateAssociations,
      type: 'error'
    })
  }
  sanitizedDomain.associations = domain.associations

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
