module.exports = {
  title: 'example',
  display_title: 'example',
  SERVER_ROOT: 'http://localhost:4040',
  EVENTS_EXT: '/api/example/export_events/deeprows',
  CATEGORIES_EXT: '/api/example/export_categories/rows',
  FILTERS_EXT: '/api/example/export_filters/tree',
  SOURCES_EXT: '/api/example/export_sources/deepids',
  NARRATIVE_EXT: '',
  SITES_EXT: '',
  SHAPES_EXT: '',
  DATE_FMT: 'MM/DD/YYYY',
  TIME_FMT: 'hh:mm',
  // MAPBOX_TOKEN: 'pk.YOUR_MAPBOX_TOKEN',
  store: {
    app: {
      map: {
        anchor: [31.356397, 34.784818]
      }
    },
    ui: {
      style: {
        // tiles: 'your-mapbox-account-name/x5678-map-id'
      }
    },
    features: {
      USE_CATEGORIES: false,
      CATEGORIES_AS_FILTERS: false,
      USE_FILTERS: false,
      USE_SOURCES: true,
      GRAPH_NONLOCATED: false,
      HIGHLIGHT_GROUPS: false,

      USE_COVER: false,
      USE_SEARCH: false,
      USE_SITES: true,
      USE_SHAPES: false,

    }
  }
}
