import moment from 'moment'
import hash from 'object-hash'

let { DATE_FMT, TIME_FMT } = process.env
if (!DATE_FMT) DATE_FMT = 'MM/DD/YYYY'
if (!TIME_FMT) TIME_FMT = 'HH:mm'

export function calcDatetime (date, time) {
  if (!time) time = '00:00'
  const dt = moment(`${date} ${time}`, `${DATE_FMT} ${TIME_FMT}`)
  return dt.toDate()
}

export function getCoordinatesForPercent (radius, percent) {
  const x = radius * Math.cos(2 * Math.PI * percent)
  const y = radius * Math.sin(2 * Math.PI * percent)
  return [x, y]
}

/**
 * This function takes the array of percentages: [0.5, 0.5, ...]
 * and maps it by index to the set of colors ['#fff', '#000', ...]
 * If there aren't enough colors in the set, it raises an error for the user
 *
 * Return value:
 * ex. {'#fff': 0.5, '#000': 0.5, ...} */
export function zipColorsToPercentages (colors, percentages) {
  if (colors.length < percentages.length) throw new Error('You must declare an appropriate number of filter colors')

  return percentages.reduce((map, percent, idx) => {
    map[colors[idx]] = percent
    return map
  }, {})
}

/**
  * Get URI params to start with predefined set of
  * https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
  * @param {string} name: name of paramater to search
  * @param {string} url: url passed as variable, defaults to window.location.href
  */
export function getParameterByName (name, url) {
  if (!url) url = window.location.href
  name = name.replace(/[[\]]/g, `\\$&`)

  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`)
  const results = regex.exec(url)

  if (!results) return null
  if (!results[2]) return ''

  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

/**
 * Compare two arrays of scalars
 * @param {array} arr1: array of numbers
 * @param {array} arr2: array of numbers
 */
export function areEqual (arr1, arr2) {
  return ((arr1.length === arr2.length) && arr1.every((element, index) => {
    return element === arr2[index]
  }))
}

/**
* Return whether the variable is neither null nor undefined
* @param {object} variable
*/
export function isNotNullNorUndefined (variable) {
  return (typeof variable !== 'undefined' && variable !== null)
}

/*
* Taken from: https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
*/
export function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function trimAndEllipse (string, stringNum) {
  if (string.length > stringNum) {
    return string.substring(0, 120) + '...'
  }
  return string
}

/**
 * From the set of associations, grab a given filter's set of parents,
 * ie. all the elements in the path array before the idx where the filter is located.
 * If we can't find the filter by the ID, we know its a meta filter, so we look
 * through every association's given path attribute to find its location.
 *
 * Returns the list of parents: ex. ['Chemical', 'Tear Gas', ...]
*/
export function getFilterParents (associations, filter) {
  for (let a of associations) {
    const { filter_paths: fp } = a
    if (a.id === filter) {
      return fp.slice(0, fp.length - 1)
    }
    const filterIndex = fp.indexOf(filter)
    if (filterIndex === 0) return []
    if (filterIndex > 0) return fp.slice(0, filterIndex)
  }
  throw new Error('Attempted to get parents of nonexistent filter')
}

/**
 * Grabs the second to last element in the paths array for a given existing filter.
 * This is the filter's most immediate ancestor.
*/
export function getImmediateFilterParent (associations, filter) {
  const parents = getFilterParents(associations, filter)
  if (parents.length === 0) return null
  return parents[parents.length - 1]
}

/**
 * Grab a meta filter's siblings, by way of the the `filter_path` hierarcy.
*/
export function getMetaFilterSiblings (allFilters, filterParent, filterKey) {
  const idxParent = allFilters.map(f => {
    return f.filter_paths.reduceRight((acc, path, idx) => {
      if (path === filterParent) return f.filter_paths[idx + 1]
      return acc
    }, null)
  })
    .filter(metaFilter => !!metaFilter && metaFilter !== filterKey)
  return [ ...(new Set(idxParent)) ]
}

/**
 * Grabs a given filter's siblings: the set of associations that share the same immediate filter parent.
*/
export function getFilterSiblings (allFilters, filterParent, filterKey) {
  const isMetaFilter = !allFilters.map(filt => filt.id).includes(filterKey)

  if (isMetaFilter) {
    return getMetaFilterSiblings(allFilters, filterParent, filterKey)
  }

  return allFilters.reduce((acc, val) => {
    const valParent = getImmediateFilterParent(allFilters, val.id)
    if (valParent === filterParent && val.id !== filterKey) acc.push(val.id)
    return acc
  }, [])
}

export function getEventCategories (event, categories) {
  const matchedCategories = []
  if (event.associations && event.associations.length > 0) {
    event.associations.reduce((acc, val) => {
      const foundCategory = categories.find(cat => cat.id === val)
      if (foundCategory) acc.push(foundCategory)
      return acc
    }, matchedCategories)
  }
  return matchedCategories
}

/**
 * Inset the full source represenation from 'allSources' into an event. The
 * function is 'curried' to allow easy use with maps. To use for a single
 * source, call with two sets of parentheses:
 *      const src = insetSourceFrom(sources)(anEvent)
 */
export function insetSourceFrom (allSources) {
  return (event) => {
    let sources
    if (!event.sources) {
      sources = []
    } else {
      sources = event.sources.map(id => {
        return allSources.hasOwnProperty(id) ? allSources[id] : null
      })
    }
    return {
      ...event,
      sources
    }
  }
}

/**
 * Debugging function: put in place of a mapStateToProps function to
 * view that source modal by default
 */
export function injectSource (id) {
  return state => {
    return {
      ...state,
      app: {
        ...state.app,
        source: state.domain.sources[id]
      }
    }
  }
}

export function urlFromEnv (ext) {
  if (process.env[ext]) {
    if (!Array.isArray(process.env[ext])) { return [`${process.env.SERVER_ROOT}${process.env[ext]}`] } else {
      return process.env[ext].map(suffix => `${process.env.SERVER_ROOT}${suffix}`)
    }
  } else {
    return null
  }
}

export function toggleFlagAC (flag) {
  return (appState) => ({
    ...appState,
    flags: {
      ...appState.flags,
      [flag]: !appState.flags[flag]
    }
  })
}

export function selectTypeFromPath (path) {
  let type
  switch (true) {
    case /\.(png|jpg)$/.test(path):
      type = 'Image'; break
    case /\.(mp4)$/.test(path):
      type = 'Video'; break
    case /\.(md)$/.test(path):
      type = 'Text'; break
    default:
      type = 'Unknown'; break
  }
  return { type, path }
}

export function typeForPath (path) {
  let type
  path = path.trim()
  switch (true) {
    case /\.((png)|(jpg)|(jpeg))$/.test(path):
      type = 'Image'; break
    case /\.(mp4)$/.test(path):
      type = 'Video'; break
    case /\.(md)$/.test(path):
      type = 'Text'; break
    case /\.(pdf)$/.test(path):
      type = 'Document'; break
    default:
      type = 'Unknown'; break
  }
  return type
}

export function selectTypeFromPathWithPoster (path, poster) {
  return { type: typeForPath(path), path, poster }
}

export function isIdentical (obj1, obj2) {
  return hash(obj1) === hash(obj2)
}

export function calcOpacity (num) {
  /* Events have opacity 0.5 by default, and get added to according to how many
   * other events there are in the same render. The idea here is that the
   * overlaying of events builds up a 'heat map' of the event space, where
   * darker areas represent more events with proportion */
  const base = num >= 1 ? 0.9 : 0
  return base + (Math.min(0.5, 0.08 * (num - 1)))
}

export function calcClusterOpacity (pointCount, totalPoints) {
  /* Clusters represent multiple events within a specific radius. The darker the cluster,
  the larger the number of underlying events. We use a multiplication factor (50) here as well
  to ensure that the larger clusters have an appropriately darker shading. */
  return Math.min(0.85, 0.08 + (pointCount / totalPoints) * 50)
}

export function calcClusterSize (pointCount, totalPoints) {
  /* The larger the cluster size, the higher the count of points that the cluster represents.
  Just like with opacity, we use a multiplication factor to ensure that clusters with higher point
  counts appear larger. */
  const maxSize = totalPoints > 60 ? 40 : 20
  return Math.min(maxSize, 10 + (pointCount / totalPoints) * 150)
}

export function calculateTotalClusterPoints (clusters) {
  return clusters.reduce((total, cl) => {
    if (cl && cl.properties && cl.properties.cluster) {
      total += cl.properties.point_count
    }
    return total
  }, 0)
}

export function isLatitude (lat) {
  return !!lat && isFinite(lat) && Math.abs(lat) <= 90
}

export function isLongitude (lng) {
  return !!lng && isFinite(lng) && Math.abs(lng) <= 180
}

export function mapClustersToLocations (clusters, locations) {
  return clusters.reduce((acc, cl) => {
    const foundLocation = locations.find(location => location.label === cl.properties.id)
    if (foundLocation) acc.push(foundLocation)
    return acc
  }, [])
}

/**
 * Loops through a set of either locations or events
 * and calculates the proportionate percentage of every given association in relation to the coloring set
*/
export function calculateColorPercentages (set, coloringSet) {
  if (coloringSet.length === 0) return [1]
  const associationMap = {}

  for (const [idx, value] of coloringSet.entries()) {
    for (let filter of value) {
      associationMap[filter] = idx
    }
  }

  const associationCounts = new Array(coloringSet.length)
  associationCounts.fill(0)

  let totalAssociations = 0

  set.forEach(item => {
    let innerSet = 'events' in item ? item.events : item

    if (!Array.isArray(innerSet)) innerSet = [innerSet]

    innerSet.forEach(val => {
      val.associations.forEach(a => {
        const idx = associationMap[a]
        if (!idx && idx !== 0) return
        associationCounts[idx] += 1
        totalAssociations += 1
      })
    })
  })

  if (totalAssociations === 0) return [1]

  return associationCounts.map(count => count / totalAssociations)
}

/**
 * Gets the idx of a given filter in relation to its position in the coloring set
 *
 * Example coloringSet = [['Chemical', 'Tear Gas'], ['Procedural', 'Destruction of property']]
 */
export function getFilterIdxFromColorSet (filter, coloringSet) {
  let filterIdx = -1
  coloringSet.map((set, idx) => {
    const foundIdx = set.indexOf(filter)
    if (foundIdx !== -1) filterIdx = idx
  })
  return filterIdx
}

export const dateMin = function () {
  return Array.prototype.slice.call(arguments).reduce(function (a, b) {
    return a < b ? a : b
  })
}

export const dateMax = function () {
  return Array.prototype.slice.call(arguments).reduce(function (a, b) {
    return a > b ? a : b
  })
}

/** Taken from
  * https://stackoverflow.com/questions/22697936/binary-search-in-javascript
  * **/
export function binarySearch (ar, el, compareFn) {
  var m = 0
  var n = ar.length - 1
  while (m <= n) {
    var k = (n + m) >> 1
    var cmp = compareFn(el, ar[k])
    if (cmp > 0) {
      m = k + 1
    } else if (cmp < 0) {
      n = k - 1
    } else {
      return k
    }
  }
  return -m - 1
}

export function makeNiceDate (datetime) {
  if (datetime === null) return null
  // see https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
  const dateTimeFormat = new Intl.DateTimeFormat(
    'en',
    { year: 'numeric', month: 'long', day: '2-digit' }
  )
  const [
    { value: month },,
    { value: day },,
    { value: year }
  ] = dateTimeFormat.formatToParts(datetime)

  return `${day} ${month} ${year}`
}
