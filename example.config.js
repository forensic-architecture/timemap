module.exports = {
  title: 'example',
  display_title: 'example',
  SERVER_ROOT: 'http://localhost:4040',
  EVENTS_EXT: '/api/timemap_data/export_events/deeprows',
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
      COLOR_BY_ASSOCIATION: true,
      USE_ASSOCIATIONS: true,
      USE_SOURCES: true,
      USE_COVER: false,
      GRAPH_NONLOCATED: false,
      HIGHLIGHT_GROUPS: false
    }
  }
}
