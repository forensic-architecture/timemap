module.exports = {
  title: 'example',
  SERVER_ROOT: 'http://localhost:4040',
  EVENT_EXT: '/api/example/export_events/deeprows',
  CATEGORY_EXT: '/api/example/export_categories/rows',
  NARRATIVE_EXT: '/api/example/export_narratives/rows',
  SOURCES_EXT: '/api/example/export_sources/deepids',
  TAGS_EXT: '/api/example/export_tags/tree',
  SITES_EXT: '/api/example/export_sites/rows',
  MAP_ANCHOR: [31.356397, 34.784818],
  INCOMING_DATETIME_FORMAT: '%m/%d/%YT%H:%M',
  MAPBOX_TOKEN: 'pk.EXAMPLE_MAPBOX_TOKEN',
  features: {
    USE_TAGS: false,
    USE_SEARCH: false,
    USE_SITES: true,
    USE_SOURCES: true,
    CATEGORIES_AS_TAGS: true
  }
}

