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
          d3.timeParse("%Y-%m-%dT%H:%M:%S")("2014-08-22T12:00:00"),
          d3.timeParse("%Y-%m-%dT%H:%M:%S")("2014-08-27T12:00:00")
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

      groupColors: {
        category_group00: "#FF0000",
        category_group01: "#226b22",
        category_group02: "#671f6f",
        category_group03: "#0000bf",
        category_group04: "#d3ce2a",
        other: "#FF0000"
      },

      palette: d3.schemeCategory10,

      narratives: {
        narrative_1: {
          style: 'dotted',                  // ['dotted', 'solid']
          opacity: 0.4,                     // range between 0 and 1
          stroke: '#ffffff',               // Any hex or rgb code
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
      isFetchingEvents: false,

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
