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
    notifications: [],
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
      source: null,
    },
    highlighted: null,
    selected: [],
    source: null,
    narrative: null,
    narrativeState: {
      current: null
    },
    filters: {
      timerange: [
        d3.timeParse("%Y-%m-%dT%H:%M:%S")("2013-02-23T12:00:00"),
        d3.timeParse("%Y-%m-%dT%H:%M:%S")("2016-02-23T12:00:00")
      ],
      tags: [],
      categories: [],
      views: {
        events: true,
        coevents: false,
        routes: false,
        sites: true
      },
    },
    base_uri: 'http://127.0.0.1:8000/', // Modify accordingly on production setup.
    isMobile: (/Mobi/.test(navigator.userAgent)),
    language: 'en-US',
    mapAnchor: process.env.MAP_ANCHOR,
    zoomLevels: [{
      label: '3 years',
      duration: 1576800,
      active: false
    },
      {
        label: '3 months',
        duration: 129600,
        active: false
      },
      {
        label: '3 days',
        duration: 4320,
        active: false
      },
      {
        label: '12 hours',
        duration: 720,
        active: false
      },
      {
        label: '2 hours',
        duration: 120,
        active: false
      },
      {
        label: '30 min',
        duration: 30,
        active: false
      },
      {
        label: '10 min',
        duration: 10,
        active: false
      }],
    flags: {
      isFetchingDomain: false,
      isFetchingSources: false,

      isCardstack: true,
      isInfopopup: false,
      isShowingSites: true
    }
  },

  /*
   * The 'ui' subtree of this state refers the state of the cosmetic
   *   elements of the application, such as color palettes of categories
   *   as well as dom elements to attach SVG
   */
  ui: {
    style: {
      categories: {
        default: 'yellow',
        // Add here other categories to differentiate by color, like:
        alpha: '#00ff00',
        beta: '#ff0000',
        other: '#f3de2c'
      },
      narratives: {
        default: {
          opacity: 0.9,
          stroke: 'red',
          strokeWidth: 3
        },
        narrative_1: {
          opacity: 0.4,
          stroke: '#f18f01',
          strokeWidth: 3
        },
        // process.env.features.NARRATIVE_STEP_STYLES
        stepStyles: {
          Physical: {
            stroke: 'yellow',
            strokeWidth: 3,
            opacity: 0.9,
          }
        }
      }
    },
    dom: {
      timeline: "timeline",
      timeslider: "timeslider",
      map: "map"
    },
  }
};

export default initial;
