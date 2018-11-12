// TODO: annotate sections of this state.

// NB: why does this canvas document need to be created?
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

const initial = {
  domain: {
    events: [],
    narratives: [],    
    locations: [],

    categories: [],
    sites: [],

    // Tag tree
    tags: { },
    notifications: [],
  },
  app: {
    error: null,
    highlighted: null,
    selected: [],
    notifications: [],
    filters: {
      range: [
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
    isWebGL: (gl && gl instanceof WebGLRenderingContext),
    language: 'en-US',
    mapAnchor: process.env.MAP_ANCHOR,
    features: {
      USE_TAGS: process.env.features.USE_TAGS,
      USE_SEARCH: process.env.features.USE_SEARCH
    }
  },
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
    },
    dom: {
      timeline: "timeline",
      timeslider: "timeslider",
      map: "map"
    },
    flags: {
      isFetchingDomain: false,
      isFetchingEvents: false,
      isView2d: true,
      isTimeline: true,
      isToolbar: false,
      isCardstack: true,
      isInfopopup: false,
      isNotification: true
    },
    tools: {
      formatter: d3.timeFormat("%d %b, %H:%M"),
      formatterWithYear: d3.timeFormat("%d %b %Y, %H:%M"),
      parser: d3.timeParse("%Y-%m-%dT%H:%M:%S")
    },
    components: {
      toolbarTab: false,
    }
  }
};

export default initial;
