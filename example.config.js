module.exports = {
  title: 'example',
  display_title: 'example',
  SERVER_ROOT: 'http://localhost:4040',
  EVENTS_EXT: '/api/timemap_data/export_events/deeprows',
  CATEGORIES_EXT: '/api/timemap_data/export_categories/rows',
  ASSOCIATIONS_EXT: '/api/timemap_data/export_associations/deeprows',
  SOURCES_EXT: '/api/timemap_data/export_sources/deepids',
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
      // tiles: 'your-mapbox-account-name/x5678-map-id'
    },
    features: {
      USE_CATEGORIES: true,
      CATEGORIES_AS_FILTERS: true,
      USE_ASSOCIATIONS: true,
      USE_SOURCES: true,
      USE_COVER: true,
      USE_SEARCH: false,
      USE_SITES: false,
      USE_SHAPES: false,
      GRAPH_NONLOHATED: false,
      HIGHLIGHT_GROUPS: false
    }
  }
}
