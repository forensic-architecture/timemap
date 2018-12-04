// TODO: move to util lib
function urlFromEnv(ext) {
  if (process.env[ext]) {
    return `${process.env.SERVER_ROOT}${process.env[ext]}`
  } else {
    return null
  }
}

// TODO: relegate these URLs entirely to environment variables
const EVENT_DATA_URL = urlFromEnv('EVENT_EXT')
const CATEGORY_URL = urlFromEnv('CATEGORY_EXT')
const TAG_URL = urlFromEnv('TAGS_EXT')
const SOURCES_URL = urlFromEnv('SOURCES_EXT')
const SITES_URL = urlFromEnv('SITES_EXT')
const eventUrlMap = (event) => `${process.env.SERVER_ROOT}${process.env.EVENT_DESC_ROOT}/${(event.id) ? event.id : event}`

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

export function fetchDomain () {
  let notifications = []

  function handleError (domainType) {
    return () => {
      notifications.push({
        message: `Something went wrong fetching ${domainType}. Check the URL or try disabling them in the config file.`,
        type: 'error'
      })
      return []
    }
  }

  return dispatch => {
    dispatch(toggleFetchingDomain())
    const promises = []

    const eventPromise = fetch(EVENT_DATA_URL)
      .then(response => response.json())
      .catch(handleError('events'))

    const catPromise = fetch(CATEGORY_URL)
      .then(response => response.json())
      .catch(handleError('categories'))

    let sitesPromise = Promise.resolve([])
    if (process.env.features.USE_SITES) {
      sitesPromise = fetch(SITES_URL)
        .then(response => response.json())
        .catch(handleError('sites'))
    }

    let tagsPromise
    if (process.env.features.USE_TAGS) {
      tagsPromise = fetch(TAG_TREE_URL)
        .then(response => response.json())
        .catch(handleError('tags'))
    }

    return Promise.all([ eventPromise, catPromise, sitesPromise, tagsPromise])
      .then(response => {
        dispatch(toggleFetchingDomain())
        const result = {
          events: response[0],
          categories: response[1],
          sites: response[2],
          tags: response[3],
          notifications
        }
        return result
      })
      .catch(err => {
        dispatch(fetchError(err.message))
        dispatch(toggleFetchingDomain())
      })
  };
}

export const FETCH_ERROR = 'FETCH_ERROR'
export function fetchError(message) {
  return {
    type: FETCH_ERROR,
    message,
  }
}

export const UPDATE_DOMAIN = 'UPDATE_DOMAIN'
export function updateDomain(domain) {
  return {
    type: UPDATE_DOMAIN,
    domain: {
      events: domain.events,
      categories: domain.categories,
      tags: domain.tags,
      sites: domain.sites,
      notifications: domain.notifications
    }
  }
}

// export function fetchEvents (events) {
//   return dispatch => {
//     dispatch(toggleFetchingEvents())
//     const urls = events.map(eventUrlMap)
//     return Promise.all(
//       urls.map(url => fetch(url)
//         .then(response => response.json())
//       )
//     )
//       .then(json => {
//         dispatch(toggleFetchingEvents())
//         return json
//       })
//   }
// }

export function fetchSelected(selected) {
  if (!selected || !selected.length || selected.length === 0) {
    console.log('hitting base')
    return updateSelected([])
  }
  return dispatch => {
    dispatch(updateSelected(selected))
    if (!SOURCES_URL) {
      dispatch(fetchSourceError('No source extension specified.'))
    } else {
      dispatch(toggleFetchingSources())
    }

    // const urls = events.map(eventUrlMap)
    // return Promise.all(
    //   urls.map(url => fetch(url)
    //     .then(response => response.json())
    //   )
    // )
    //   .then(json => {
    //     dispatch(toggleFetchingEvents())
    //     return json
    //   })
    // TODO: fetch sources
    // Now fetch detail data for each event
    // Add transmitter and receiver data for coevents
    // this.props.actions.fetchEvents(selected)
    //   .then((events) => {
    //     let eventsSelected = events.map(ev => {
    //       return Object.assign({}, ev, this.getEventById(ev.id));
    //     });

    //     eventsSelected = eventsSelected.sort((a, b) => {
    //       return parser(a.timestamp) - parser(b.timestamp);
    //     });

    //     this.props.actions.updateSelected(eventsSelected);
    //   });
  }
}

export const UPDATE_HIGHLIGHTED = 'UPDATE_HIGHLIGHTED'
export function updateHighlighted(highlighted) {
  return {
    type: UPDATE_HIGHLIGHTED,
    highlighted: highlighted
  }
}

export const UPDATE_SELECTED = 'UPDATE_SELECTED'
export function updateSelected(selected) {
  return {
    type: UPDATE_SELECTED,
    selected: selected
  }
}

export const UPDATE_DISTRICT = 'UPDATE_DISTRICT'
export function updateDistrict(district) {
  return {
    type: UPDATE_DISTRICT,
    district
  }
}

export const UPDATE_TAGFILTERS = 'UPDATE_TIMEFILTERS'
export function updateTagFilters(tag) {
  return {
    type: UPDATE_TAGFILTERS,
    tag
  }
}

export const UPDATE_TIMERANGE = 'UPDATE_TIMERANGE';
export function updateTimeRange(timerange) {
  return {
    type: UPDATE_TIMERANGE,
    timerange
  }
}

export const RESET_ALLFILTERS = 'RESET_ALLFILTERS'
export function resetAllFilters() {
  return {
    type: RESET_ALLFILTERS
  }
}

// UI

export const TOGGLE_FETCHING_DOMAIN = 'TOGGLE_FETCHING_DOMAIN'
export function toggleFetchingDomain() {
  return {
    type: TOGGLE_FETCHING_DOMAIN
  }
}

export const TOGGLE_FETCHING_SOURCES = 'TOGGLE_FETCHING_SOURCES'
export function toggleFetchingSources() {
  return {
    type: TOGGLE_FETCHING_SOURCES
  }
}

export const TOGGLE_LANGUAGE = 'TOGGLE_LANGUAGE';
export function toggleLanguage(language) {
  return {
    type: TOGGLE_LANGUAGE,
    language,
  }
}

export const CLOSE_TOOLBAR = 'CLOSE_TOOLBAR';
export function closeToolbar() {
  return {
    type: CLOSE_TOOLBAR
  }
}

export const TOGGLE_INFOPOPUP = 'TOGGLE_INFOPOPUP';
export function toggleInfoPopup() {
  return {
    type: TOGGLE_INFOPOPUP
  }
}

export const TOGGLE_NOTIFICATIONS = 'TOGGLE_NOTIFICATIONS'
export function toggleNotifications() {
  return {
    type: TOGGLE_NOTIFICATIONS
  }
}

// ERRORS

export const FETCH_SOURCE_ERROR = 'FETCH_SOURCE_ERROR'
export function fetchSourceError(msg) {
  return {
    type: FETCH_SOURCE_ERROR,
    msg
  }
}
