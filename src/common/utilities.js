import { timeFormat, timeParse } from 'd3'

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
* Capitalizes _only_ the first letter of a string
* Taken from: https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
*/
export function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function trimAndEllipse (string, stringNum) {
  if (string.length > stringNum) {
    return string.substring(0, 120) + '...'
  }
  return string
}

/**
* Return a Date object given a datetime string of the format: "2016-09-10T07:00:00"
* @param {string} datetime
*/
export function parseDate (datetime) {
  return new Date(datetime.slice(0, 4),
    datetime.slice(5, 7) - 1,
    datetime.slice(8, 10),
    datetime.slice(11, 13),
    datetime.slice(14, 16),
    datetime.slice(17, 19)
  )
}

export function formatterWithYear (datetime) {
  return timeFormat('%d %b %Y, %H:%M')(datetime)
}

export function formatter (datetime) {
  return timeFormat('%d %b, %H:%M')(datetime)
}

export const parseTimestamp = ts => timeParse('%Y-%m-%dT%H:%M:%S')(ts)

export function compareTimestamp (a, b) {
  return (parseTimestamp(a.timestamp) > parseTimestamp(b.timestamp))
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
      sources = event.sources.map(id => (
        allSources.hasOwnProperty(id) ? allSources[id] : null
      ))
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
    return `${process.env.SERVER_ROOT}${process.env[ext]}`
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
    case /\.((png)|(jpg))$/.test(path):
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
