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
  store: {
    app: {
      map: {
        anchor: [31.356397, 34.784818]
      }
    },
    features: {
      USE_CATEGORIES: false,
      USE_ASSOCIATIONS: true,
      USE_SOURCES: false,
      USE_COVER: false,
      GRAPH_NONLOCATED: false,
      HIGHLIGHT_GROUPS: false
    }
  }
}
