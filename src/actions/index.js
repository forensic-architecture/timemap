/* global fetch, alert */
import { urlFromEnv } from '../common/utilities'

// TODO: relegate these URLs entirely to environment variables
// const CONFIG_URL = urlFromEnv('CONFIG_EXT')
const EVENT_DATA_URL = urlFromEnv('EVENTS_EXT')
const ASSOCIATIONS_URL = urlFromEnv('ASSOCIATIONS_EXT')
const SOURCES_URL = urlFromEnv('SOURCES_EXT')
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

  return (dispatch, getState) => {
    const features = getState().features
    dispatch(toggleFetchingDomain())

    // let configPromise = Promise.resolve([])
    // if (features.USE_REMOTE_CONFIG) {
    //   configPromise = fetch(CONFIG_URL)
    //     .then(response => response.json())
    //     .catch(() => handleError("Couldn't find data at the config URL you specified."))
    // }

    // NB: EVENT_DATA_URL is a list, and so results are aggregated
    const eventPromise = Promise.all(
      EVENT_DATA_URL.map(url => fetch(url)
        .then(response => response.json())
        .catch(() => handleError('events'))
      )
    ).then(results => results.flatMap(t => t))

    let associationsPromise = Promise.resolve([])
    if (features.USE_ASSOCIATIONS) {
      if (!ASSOCIATIONS_URL) {
        associationsPromise = Promise.resolve(handleError('USE_ASSOCIATIONS is true, but you have not provided a ASSOCIATIONS_EXT'))
      } else {
        associationsPromise = fetch(ASSOCIATIONS_URL)
          .then(response => response.json())
          .catch(() => handleError(domainMsg('associations')))
      }
    }

    let sourcesPromise = Promise.resolve([])
    if (features.USE_SOURCES) {
      if (!SOURCES_URL) {
        sourcesPromise = Promise.resolve(handleError('USE_SOURCES is true, but you have not provided a SOURCES_EXT'))
      } else {
        sourcesPromise = fetch(SOURCES_URL)
          .then(response => response.json())
          .catch(() => handleError(domainMsg('sources')))
      }
    }

    let sitesPromise = Promise.resolve([])
    if (features.USE_SITES) {
      sitesPromise = fetch(SITES_URL)
        .then(response => response.json())
        .catch(() => handleError(domainMsg('sites')))
    }

    let shapesPromise = Promise.resolve([])
    if (features.USE_SHAPES) {
      shapesPromise = fetch(SHAPES_URL)
        .then(response => response.json())
        .catch(() => handleError(domainMsg('shapes')))
    }

    return Promise.all([
      eventPromise,
      associationsPromise,
      sourcesPromise,
      sitesPromise,
      shapesPromise
    ])
      .then(response => {
        const result = {
          events: response[0],
          associations: response[1],
          sources: response[2],
          sites: response[3],
          shapes: response[4],
          notifications
        }
        if (Object.values(result).some(resp => resp.hasOwnProperty('error'))) {
          throw new Error('Some URLs returned negative. If you are in development, check the server is running')
        }
        dispatch(toggleFetchingDomain())
        dispatch(setInitialCategories(result.associations))
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
export function updateDomain (payload) {
  return {
    type: UPDATE_DOMAIN,
    payload
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

export const TOGGLE_ASSOCIATIONS = 'TOGGLE_ASSOCIATIONS'
export function toggleAssociations (association, value, shouldColor) {
  return {
    type: TOGGLE_ASSOCIATIONS,
    association,
    value,
    shouldColor
  }
}

export const SET_LOADING = 'SET_LOADING'
export function setLoading () {
  return {
    type: SET_LOADING
  }
}

export const SET_NOT_LOADING = 'SET_NOT_LOADING'
export function setNotLoading () {
  return {
    type: SET_NOT_LOADING
  }
}

export const SET_INITIAL_CATEGORIES = 'SET_INITIAL_CATEGORIES'
export function setInitialCategories (values) {
  return {
    type: SET_INITIAL_CATEGORIES,
    values
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

export const UPDATE_NARRATIVE_STEP_IDX = 'UPDATE_NARRATIVE_STEP_IDX'
export function updateNarrativeStepIdx (idx) {
  return {
    type: UPDATE_NARRATIVE_STEP_IDX,
    idx
  }
}

export const UPDATE_SOURCE = 'UPDATE_SOURCE'
export function updateSource (source) {
  return {
    type: UPDATE_SOURCE,
    source
  }
}

export const UPDATE_COLORING_SET = 'UPDATE_COLORING_SET'
export function updateColoringSet (coloringSet) {
  return {
    type: UPDATE_COLORING_SET,
    coloringSet
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

export const TOGGLE_INTROPOPUP = 'TOGGLE_INTROPOPUP'
export function toggleIntroPopup () {
  return {
    type: TOGGLE_INTROPOPUP
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

export const UPDATE_SEARCH_QUERY = 'UPDATE_SEARCH_QUERY'
export function updateSearchQuery (searchQuery) {
  return {
    type: UPDATE_SEARCH_QUERY,
    searchQuery
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
