module.exports = {
  title: 'example',
  display_title: 'example',
  SERVER_ROOT: 'http://localhost:4040',
  EVENT_EXT: '/api/example/export_events/deeprows',
  CATEGORY_EXT: '/api/example/export_categories/rows',
  NARRATIVE_EXT: '/api/example/export_narratives/rows',
  SOURCES_EXT: '/api/example/export_sources/deepids',
  TAGS_EXT: '/api/example/export_tags/tree',
  SITES_EXT: '/api/example/export_sites/rows',
  SHAPES_EXT: '/api/example/export_shapes/columns',
  INCOMING_DATETIME_FORMAT: '%m/%d/%YT%H:%M',
  // MAPBOX_TOKEN: 'pk.YOUR_MAPBOX_TOKEN',
  store: {
    app: {
      map: {
        anchor: [31.356397, 34.784818]
      }
    },
    ui: {
      style: {
        categories: {
          // alpha: 'blue',
          beta: 'orange'
        },
        shapes: {},
        narratives: {},
        selectedEvent: {}
        // tiles: 'your-mapbox-account-name/x5678-map-id'
      }
    },
    features: {
      USE_COVER: false,
      USE_TAGS: false,
      USE_SEARCH: false,
      USE_SITES: true,
      USE_SOURCES: true,
      USE_SHAPES: false,
      CATEGORIES_AS_TAGS: true,
      GRAPH_NONLOCATED: false,
      HIGHLIGHT_GROUPS: false
    }
  }
}
