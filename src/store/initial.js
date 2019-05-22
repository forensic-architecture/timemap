import { mergeDeepLeft } from 'ramda'
import colors from '../common/global.js'

const initial = {
  /*
   * The Domain or 'domain' of this state refers to the tree of data
   *  available for render and display.
   * Selections and filters in the 'app' subtree will operate the domain
   *   in mapStateToProps of the Dashboard, and deterimne which items
   *   in the domain will get rendered by React
   */
  domain: {
    events: [],
    narratives: [],
    locations: [],
    categories: [],
    sources: {},
    sites: [],
    tags: {},
    notifications: []
  },

  /*
   * The 'app' subtree of this state determines the data and information to be
   *   displayed.
   * It may refer to those the user interacts with, by selecting,
   *   fitlering and so on, which ultimately operate on the data to be displayed.
   * Additionally, some of the 'app' flags are determined by the config file
   *   or by the characteristics of the client, browser, etc.
   */
  app: {
    errors: {
      source: null
    },
    highlighted: null,
    selected: [],
    source: null,
    narrative: null,
    narrativeState: {
      current: null
    },
    filters: {
      tags: [],
      categories: [],
      views: {
        events: true,
        routes: false,
        sites: true
      }
    },
    isMobile: (/Mobi/.test(navigator.userAgent)),
    language: 'en-US',
    map: {
      anchor: [31.356397, 34.784818],
      startZoom: 11,
      minZoom: 6,
      maxZoom: 18,
      bounds: null,
      maxBounds: [[180, -180], [-180, 180]]
    },
    timeline: {
      dimensions: {
        height: 140,
        width: 0,
        width_controls: 100,
        height_controls: 115,
        margin_left: 200,
        margin_top: 20,
        trackHeight: 80
      },
      range: [
        new Date(2013, 2, 23, 12),
        new Date(2016, 2, 23, 12)
      ],
      zoomLevels: [
        { label: '3 years', duration: 1576800 },
        { label: '3 months', duration: 129600 },
        { label: '3 days', duration: 4320 },
        { label: '12 hours', duration: 720 },
        { label: '2 hours', duration: 120 },
        { label: '30 min', duration: 30 },
        { label: '10 min', duration: 10 }
      ]
    },
    flags: {
      isFetchingDomain: false,
      isFetchingSources: false,
      isCover: true,
      isCardstack: true,
      isInfopopup: true,
      isShowingSites: true
    },
    cover: {
      title: 'project title',
      subtitle: 'project subtitle',
      description: 'A description of the project goes here.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nThis description may contain markdown.\n\n#### markdown\n\n### markdown\n\n## markdown'
    }
  },

  /*
   * The 'ui' subtree of this state refers the state of the cosmetic
   *   elements of the application, such as color palettes of categories
   *   as well as dom elements to attach SVG
   */
  ui: {
    tiles: 'openstreetmap', // ['openstreetmap', 'streets', 'satellite']
    style: {
      categories: {
        default: colors.fa_red
      },
      narratives: {
        default: {
          opacity: 0.9,
          stroke: colors.fa_red,
          strokeWidth: 3
        }
      },
      shapes: {
        default: {
          stroke: 'blue',
          strokeWidth: 3,
          opacity: 0.9
        }
      }
    },
    dom: {
      timeline: 'timeline',
      timeslider: 'timeslider',
      map: 'map'
    }
  }
}

let appStore
if (process.env.store) {
  appStore = mergeDeepLeft(process.env.store, initial)
} else {
  appStore = initial
}

// NB: config.js dates get implicitly converted to strings in mergeDeepLeft
appStore.app.timeline.range[0] = new Date(appStore.app.timeline.range[0])
appStore.app.timeline.range[1] = new Date(appStore.app.timeline.range[1])

export default appStore
