# Configuration

**NOTE: WIP. These settings are currently slightly out of date.**

In order to make timemap interesting, you need to configure it to read events. When loaded in a browser, timemap queries HTTP endpoint, expecting from them well-defined JSON objects. There are certain endpoints, such as `events`, that are required, while others , such as `filters`, are optional; when provided, they enhance a timemap instance with additional features and capabilities related to the additional data.

The URLs for these endpoints, as well as other configurable settings in your timemap instance, are read from the `config.js` that you created in step 3 of the setup above. The example contains sensible defaults. This section covers each option in more detail: 

| Option  | Description | Type | Nullable |
| ------- | ----------- | ---- | -------- |
| title | Title of the application, display in the toolbar | String | No |
| SERVER_ROOT | Base URI for the server | String | No |
| EVENT_EXT | Endpoint for events, which will be concatenated with SERVER_ROOT | String | No |
| EVENT_DESC_ROOT | Endpoint for additional metadata for each individual event, concatenated to SERVER_ROOT | String | Yes |
| CATEGORY_EXT | Endpoint for categories, concatenated with SERVER_ROOT | String | Yes |
| NARRATIVE_EXT | Endpoint for narratives, concatenated with SERVER_ROOT | String | No |
| FILTER_TREE_EXT | Endpoint for filters, concatenated with SERVER_ROOT | String | Yes |
| SITES_EXT | Endpoint for sites, concatenated with SERVER_ROOT | String | Yes |
| MAP_ANCHOR | Geographic coordinates for original map anchor | Array of numbers | No |
| MAPBOX_TOKEN | Access token for Mapbox satellite imagery | String | No |
| features.USE_ASSOCIATIONS | Enable / Disable filters | boolean | No |
| features.USE_SITES | Enable / Disable sites | boolean | No |

In this configuration file you'll need to add your Mapbox token (see [here for more info](https://www.mapbox.com/help/define-access-token/)). Additionally, you'll need to replace the required endpoints by functioning ones. Finally, you'll want to initialize your application set in `MAP_ANCHOR`, as a (lat, long) pair, which determines the specific location at which the application will center itself on start.

### Data requirements

This section outlines the data requirements for each HTTP endpoint.

The sum total of data that is fetched asynchronously in a timemap instance is
referred to as the application `domain`. The base endpoint for the domain-- and
the paths to required and optional endpoints-- are configured through
a `config.js` file in timemap's root folder (explained in the next section).

#### Required endpoints

1. **Events**: incidents mapped in time and space are called `events`. They must include the following fields:

```json
[
  {
    "desc":"SOME DESCRIPTION TEXT",
    "date":"8/23/2011",
    "time":"18:30",
    "location":"LOCATION_NAME",
    "lat":"17.810358",
    "long":"-18.2251664",
    "source":"",
    "filters": "",
    "category": ""
  }
]
```


2. **Categories**: events must be grouped in `categories`. **All `events` must contain one (and only one) `category`.** An event's category determines how it is displayed in the both the timeline and the map. (Category styling is configurable, but by default each category has an associated color, and a separate timeline for events in it.) Categories are designed to aggregate incidents according to some kind of categorical distinction, which will differ depending on your dataset. For example, categories may correspond to population groups, actions committed by particular persons. Categories should probably not be coded according to locality or temporality, as these axes are already represented.

```json
[
  {
    "category":"Category 00",
    "category_label":"Category Label",
    "group":"category_group00",
    "group_label":"Events"
  }
]
```

#### Optional endpoints

3. **Filters**: `events` can be filterged by multiple `filters`. These will further characterize the event, and allow to select or deselect based on them. Filters are or can be distributed in a tree-like hierarchy, and each node on the tree can be a filter, including those who are not leafs.

```json
{
   "key":"filters",
   "children": {
      "filter0": {
         "key": "filter0 ",
         "children": {
            "filter00": {
               "key": "filter00",
               "children": {
                 "filter001": {
                    "key": "filter001",
                    "children": {}
                 }
               }
            },
            "filter01": {
               "key": "filter01",
               "children": {}
            }
         }
      },
      "filter1": {
         "key": "filter1",
         "children": {
            "filter10": {
               "key": "filter10",
               "children": {}
            }
         }
      }
   }
}
```

4. **Sites**: sites are labels on the map, aiming to highlight particularly relevant locations that should not be a function of time or filters.

```json
[
  {
    "id":"1",
    "description":"SITE_DESCRIPTION",
    "site":"SITE_LABEL",
    "latitude":"17.810358",
    "longitude":"-18.2251664"
  }
]
```


