module.exports = {
  title: 'example',
  SERVER_ROOT: 'http://localhost:4040',
  EVENT_EXT: '/api/example/export_events/deeprows',
  CATEGORY_EXT: '/api/example/export_categories/rows',
  NARRATIVE_EXT: '/api/example/export_narratives/rows',
  SOURCES_EXT: '/api/example/export_sources/deepids',
  TAGS_EXT: '/api/example/export_tags/tree',
  SITES_EXT: '/api/example/export_sites/rows',
  SHAPES_EXT: '/api/example/export_shapes/columns',
  INCOMING_DATETIME_FORMAT: '%m/%d/%YT%H:%M',
  MAPBOX_TOKEN: 'pk.EXAMPLE_MAPBOX_TOKEN',
  features: {
    USE_COVER: false,
    USE_TAGS: false,
    USE_SEARCH: false,
    USE_SITES: true,
    USE_SOURCES: true,
    USE_SHAPES: true,
    CATEGORIES_AS_TAGS: true
  },
  store: {
    app: {
      cover: {
        title: 'project title',         //required
        subtitle: 'project subtitle',   //required
        description: 'A description of the project goes here.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nThis description may contain markdown.\n\n#### markdown\n\n### markdown\n\n## markdown', //required
        // subsubtitle: '<project subsubtitle>',
        // bgVideo:'<url for bakground video>',
        // howToVideo: {
        //   title: '<how to video title>',
        //   desc: 'This step-by-step guide explores the way that the platform arranges and presents information.',
        //   file: '<url for how to video>',
        //   poster: '<poster for how to video>'
        // },
        //  - up to 4 additional videos can be included -
        // videos: [
        //   {
        //     title: '<video 1 title>',
        //     desc: '<video 1 description>',
        //     file: '<url for video 1 file>',
        //     poster: '<url for video 1 poster>',
        //     buttonTitle: '<video 1 button title>',
        //     buttonSubtitle: '<video 1 button subtitle>'
        //   }
        // ]
      },
      map: {
        anchor: [31.356397, 34.784818]
      },
      timeline: {
        range: [
          new Date(2014, 7, 9),
          new Date(2014, 10, 6, 23)
        ],
        rangeLimits: [
          new Date(2014, 5, 9),
          new Date(2018, 1, 6, 23)
        ]
      }
    }
  },
  ui: {
    style: {
      categories: {},
      shapes: {},
      narratives: {},
      selectedEvent: {}
    }
  }
}
