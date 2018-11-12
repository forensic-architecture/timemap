module.exports = {
  title: 'EXAMPLE_TITLE',
  SERVER_ROOT: 'http://localhost:4040',
  EVENT_EXT: '/api/<ORIGIN_NAME>/MAP2D_dev/rows',
  CATEGORY_EXT: '/api/<ORIGIN_NAME>/MAP2D_dev_category/rows',
  EVENT_DESC_ROOT: '/api/<ORIGIN_NAME>/MAP2D_dev/ids',
  TAG_TREE_EXT: '/api/<ORIGIN_NAME>/MAP2D_dev_tags/tree',
  SITES_EXT: '/api/<ORIGIN_NAME>/MAP2D_dev_sites/rows',
  MAP_ANCHOR: [27.5813121, -18.5161798],
  INCOMING_DATETIME_FORMAT: '%m/%d/%YT%H:%M',
  MAPBOX_TOKEN: 'SOME_MAPBOX_TOKEN',
  features: {
    USE_TAGS: false,
    USE_SEARCH: false,
    USE_SITES: false
  }
}
