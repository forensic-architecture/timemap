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
  // MAPBOX_TOKEN: 'pk.EXAMPLE_MAPBOX_TOKEN',
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

}
