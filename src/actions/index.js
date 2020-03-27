/* global fetch, alert */
import { urlFromEnv } from '../common/utilities'

// TODO: relegate these URLs entirely to environment variables
const EVENT_DATA_URL = urlFromEnv('EVENT_EXT')
const CATEGORY_URL = urlFromEnv('CATEGORY_EXT')
const TAGS_URL = urlFromEnv('TAGS_EXT')
const SOURCES_URL = urlFromEnv('SOURCES_EXT')
const NARRATIVE_URL = urlFromEnv('NARRATIVE_EXT')
const SITES_URL = urlFromEnv('SITES_EXT')
const SHAPES_URL = urlFromEnv('SHAPES_EXT')

const domainMsg = (domainType) => `Something went wrong fetching ${domainType}. Check the URL or try disabling them in the config file.`

export function fetchDomain () {
  let notifications = []

  function handleError (message) {
    notifications.push({
      message,
      type: 'error'
    })
    return []
  }

  return dispatch => {
    dispatch(toggleFetchingDomain())

    const eventPromise = fetch(EVENT_DATA_URL)
      .then(response => response.json())
      .catch(() => handleError('events'))

    const catPromise = fetch(CATEGORY_URL)
      .then(response => response.json())
      .catch(() => handleError(domainMsg('categories')))

    let narPromise = Promise.resolve([])
    if (process.env.features.USE_CATEGORIES) {
      narPromise = fetch(NARRATIVE_URL)
        .then(response => response.json())
        .catch(() => handleError(domainMsg('narratives')))
    }

    let sitesPromise = Promise.resolve([])
    if (process.env.features.USE_SITES) {
      sitesPromise = fetch(SITES_URL)
        .then(response => response.json())
        .catch(() => handleError(domainMsg('sites')))
    }

    let tagsPromise = Promise.resolve([])
    if (process.env.features.USE_TAGS) {
      if (!TAGS_URL) {
        tagsPromise = Promise.resolve(handleError('USE_TAGS is true, but you have not provided a TAGS_EXT'))
      } else {
        tagsPromise = fetch(TAGS_URL)
          .then(response => response.json())
          .catch(() => handleError(domainMsg('tags')))
      }
    }

    let sourcesPromise = Promise.resolve([])
    if (process.env.features.USE_SOURCES) {
      if (!SOURCES_URL) {
        sourcesPromise = Promise.resolve(handleError('USE_SOURCES is true, but you have not provided a SOURCES_EXT'))
      } else {
        sourcesPromise = fetch(SOURCES_URL)
          .then(response => response.json())
          .catch(() => handleError(domainMsg('sources')))
      }
    }

    let shapesPromise = Promise.resolve([])
    if (process.env.features.USE_SHAPES) {
      shapesPromise = fetch(SHAPES_URL)
        .then(response => response.json())
        .catch(() => handleError(domainMsg('shapes')))
    }

    return Promise.all([
      eventPromise,
      catPromise,
      narPromise,
      sitesPromise,
      tagsPromise,
      sourcesPromise,
      shapesPromise
    ])
      .then(response => {
        const result = {
          events: response[0],
          categories: response[1],
          narratives: response[2],
          sites: response[3],
          tags: response[4],
          sources: response[5],
          shapes: response[6],
          notifications
        }
        if (Object.values(result).some(resp => resp.hasOwnProperty('error'))) {
          throw new Error('Some URLs returned negative. If you are in development, check the server is running')
        }
        return result
      })
      .catch(err => {
        dispatch(fetchError(err.message))
        dispatch(toggleFetchingDomain())
        // TODO: handle this appropriately in React hierarchy
        alert(err.message)
      })
  }
}

export const FETCH_ERROR = 'FETCH_ERROR'
export function fetchError (message) {
  return {
    type: FETCH_ERROR,
    message
  }
}

export const UPDATE_DOMAIN = 'UPDATE_DOMAIN'
export function updateDomain (domain) {
  return {
    type: UPDATE_DOMAIN,
    domain
  }
}

export function fetchSource (source) {
  return dispatch => {
    if (!SOURCES_URL) {
      dispatch(fetchSourceError('No source extension specified.'))
    } else {
      dispatch(toggleFetchingSources())

      fetch(`${SOURCES_URL}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('No sources are available at the URL specified in the config specified.')
          } else {
            return response.json()
          }
        })
        .catch(err => {
          dispatch(fetchSourceError(err.message))
          dispatch(toggleFetchingSources())
        })
    }
  }
}

export const UPDATE_HIGHLIGHTED = 'UPDATE_HIGHLIGHTED'
export function updateHighlighted (highlighted) {
  return {
    type: UPDATE_HIGHLIGHTED,
    highlighted: highlighted
  }
}

export const UPDATE_SELECTED = 'UPDATE_SELECTED'
export function updateSelected (selected) {
  return {
    type: UPDATE_SELECTED,
    selected: selected
  }
}

export const UPDATE_DISTRICT = 'UPDATE_DISTRICT'
export function updateDistrict (district) {
  return {
    type: UPDATE_DISTRICT,
    district
  }
}

export const CLEAR_FILTER = 'CLEAR_FILTER'
export function clearFilter (filter) {
  return {
    type: CLEAR_FILTER,
    filter
  }
}

export const TOGGLE_FILTER = 'TOGGLE_FILTER'
export function toggleFilter (filter, value) {
  return {
    type: TOGGLE_FILTER,
    filter,
    value
  }
}

export const UPDATE_TIMERANGE = 'UPDATE_TIMERANGE'
export function updateTimeRange (timerange) {
  return {
    type: UPDATE_TIMERANGE,
    timerange
  }
}

export const UPDATE_DIMENSIONS = 'UPDATE_DIMENSIONS'
export function updateDimensions (dims) {
  return {
    type: UPDATE_DIMENSIONS,
    dims
  }
}

export const UPDATE_NARRATIVE = 'UPDATE_NARRATIVE'
export function updateNarrative (narrative) {
  return {
    type: UPDATE_NARRATIVE,
    narrative
  }
}

export const INCREMENT_NARRATIVE_CURRENT = 'INCREMENT_NARRATIVE_CURRENT'
export function incrementNarrativeCurrent () {
  return {
    type: INCREMENT_NARRATIVE_CURRENT
  }
}

export const DECREMENT_NARRATIVE_CURRENT = 'DECREMENT_NARRATIVE_CURRENT'
export function decrementNarrativeCurrent () {
  return {
    type: DECREMENT_NARRATIVE_CURRENT
  }
}

export const UPDATE_SOURCE = 'UPDATE_SOURCE'
export function updateSource (source) {
  return {
    type: UPDATE_SOURCE,
    source
  }
}

// UI

export const TOGGLE_SITES = 'TOGGLE_SITES'
export function toggleSites () {
  return {
    type: TOGGLE_SITES
  }
}

export const TOGGLE_FETCHING_DOMAIN = 'TOGGLE_FETCHING_DOMAIN'
export function toggleFetchingDomain () {
  return {
    type: TOGGLE_FETCHING_DOMAIN
  }
}

export const TOGGLE_FETCHING_SOURCES = 'TOGGLE_FETCHING_SOURCES'
export function toggleFetchingSources () {
  return {
    type: TOGGLE_FETCHING_SOURCES
  }
}

export const TOGGLE_LANGUAGE = 'TOGGLE_LANGUAGE'
export function toggleLanguage (language) {
  return {
    type: TOGGLE_LANGUAGE,
    language
  }
}

export const CLOSE_TOOLBAR = 'CLOSE_TOOLBAR'
export function closeToolbar () {
  return {
    type: CLOSE_TOOLBAR
  }
}

export const TOGGLE_INFOPOPUP = 'TOGGLE_INFOPOPUP'
export function toggleInfoPopup () {
  return {
    type: TOGGLE_INFOPOPUP
  }
}

export const TOGGLE_NOTIFICATIONS = 'TOGGLE_NOTIFICATIONS'
export function toggleNotifications () {
  return {
    type: TOGGLE_NOTIFICATIONS
  }
}

export const MARK_NOTIFICATIONS_READ = 'MARK_NOTIFICATIONS_READ'
export function markNotificationsRead () {
  return {
    type: MARK_NOTIFICATIONS_READ
  }
}

export const TOGGLE_COVER = 'TOGGLE_COVER'
export function toggleCover () {
  return {
    type: TOGGLE_COVER
  }
}

// ERRORS

export const FETCH_SOURCE_ERROR = 'FETCH_SOURCE_ERROR'
export function fetchSourceError (msg) {
  return {
    type: FETCH_SOURCE_ERROR,
    msg
  }
}
