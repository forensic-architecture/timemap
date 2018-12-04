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
    error: null,
    highlighted: null,
    selected: [],
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
      label: '3 años',
      duration: 1576800,
      active: false
    },
    {
      label: '3 meses',
      duration: 129600,
      active: false
    },
    {
      label: '3 días',
      duration: 4320,
      active: false
    },
    {
      label: '12 horas',
      duration: 720,
      active: false
    },
    {
      label: '2 horas',
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
    features: {
      USE_TAGS: process.env.features.USE_TAGS,
      USE_SEARCH: process.env.features.USE_SEARCH
    }
  },

  /*
  * The 'ui' subtree of this state refers the state of the cosmetic
  *   elements of the application, such as color palettes of groups or how some
  *   of the UI tools are enabled or disabled dynamically by the user
  */
  ui: {
    style: {

      colors: {
        WHITE: "#efefef",
        YELLOW: "#ffd800",
        MIDGREY: "rgb(44, 44, 44)",
        DARKGREY: "#232323",
        PINK: "#F28B50",//rgb(232, 9, 90)",
        ORANGE: "#F25835",//rgb(232, 9, 90)",
        RED: "rgb(233, 0, 19)",
        BLUE: "#F2DE79",//"rgb(48, 103 , 217)",
        GREEN: "#4FF2F2",//"rgb(0, 158, 86)",
      },

      palette: d3.schemeCategory10,

      categories: {
        default: 'red',
        // Add here other categories to differentiate by color, like:
        alpha: '#00ff00',
        beta: '#ff0000',
        other: 'yellow'
      },

      narratives: {
        default: {
          style: 'solid',                  // ['dotted', 'solid']
          opacity: 0.9,                     // range between 0 and 1
          stroke: 'red',               // Any hex or rgb code
          strokeWidth: 5
        },
        narrative_1: {
          style: 'solid',                  // ['dotted', 'solid']
          opacity: 0.4,                     // range between 0 and 1
          stroke: 'red',               // Any hex or rgb code
          strokeWidth: 2
        }
      }
    },
    dom: {
      timeline: "timeline",
      timeslider: "timeslider",
      map: "map"
    },
    flags: {
      isFetchingDomain: false,
      isFetchingSources: false,

      isCardstack: true,
      isInfopopup: false,
      isNotification: true
    },
    tools: {
      formatter: d3.timeFormat("%d %b, %H:%M"),
      formatterWithYear: d3.timeFormat("%d %b %Y, %H:%M"),
      parser: d3.timeParse("%Y-%m-%dT%H:%M:%S")
    }
  }
};

export default initial;
