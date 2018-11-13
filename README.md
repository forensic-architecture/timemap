<h1 align="center">
  TimeMap v0
</h1>

<p align="center">
  <strong>TimeMap is a tool for exploration, monitoring and classification of incidents in time and space.</strong><br>
</p>
<p align="center">
  <a href="https://github.com/forensic-architecture/timemap/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="TimeMap is released under the MIT license." />
  </a>
  <a href="https://travis-ci.com/forensic-architecture/timemap">
    <img src="https://travis-ci.com/forensic-architecture/timemap.svg?branch=develop" alt="Build Status"/>}
  </a>
</p>

## Overview

TimeMap is a standalone frontend application that allows to explore and monitor events in time and space. TimeMap uses [mapbox](https://www.mapbox.com/) satellite imagery as a backdrop by default, and uses Leaflet and d3 to visually map information.

The application is backend agnostic. It does, however, have some requirements regarding the format of data to be ingested. TimeMap works well in tandem with [datasheet-server](https://github.com/breezykermo/datasheet-server), particularly for journalist, activists and general users who are used to working using spreadsheets and just want a shell to visualize events.

TimeMap has the following high-level features capabilites:

* Visualize incidents of particular events on a map.
* Visualize and filter these incidents over time, on an adjustable timeline that allows to zoom in and out.
* Visualize types of incidents by tag and by category, which can be displayed using different styles.

A fully-functioning live version can be found as a result of the Forensic Architecture investigation of the [Ayotzinapa case](www.plataforma-ayotzinapa.org).

## Get up and running

### Requirements

To run a TimeMap instance, you'll need:

* You'll need git, node and npm / yarn installed.
* A (free) account at Mapbox, so that you can get a token, in order for the satellite imagery in the map backdrop to be properly rendered.
* A way to serve data. We recommend using [datasheet-server](https://github.com/breezykermo/datasheet-server), which allows to using Google Spreadsheets as the data source.

### Getting started

Note that these commands assume a Bash shell in Mac/Linux:

1. Pull this repository.

```shell
git clone https://github.com/forensic-architecture/timemap
```

2. Install dependencies via yarn (recommended, it's just faster) or npm.

```shell
yarn          # npm install
```

3. Run it via yarn.

```shell
yarn dev      # npm run dev
```

IMPORTANT: Although the application will run _just like that_, in order for TimeMap to be able to display interesting information, you'll have to make sure to have the capacity to serve data, as well as adjusting some configuration parameters. See next section.

### Serving data

In order to see anything interesting on a TimeMap instance, you will need to have a way to serve data to it. The easiest way is to create the appropriate routes through [datesheet-server](), another Forensic Architecture open source project that has been developed as a configurable proxy between a frontend application (such as a TimeMap instance) and a Google Spreadsheet. It is thought for users that do not want or know how to run their own server or backend application.

However, you can also use TimeMap as a frontend for a different type of server, for instance pulling information from a relational database.

#### Data requirements

TimeMap is backend agnostic, but it requires a series of endpoints to provide data for it to visualize. The data is expected in JSON format. Some data elements are required and their format has some required fields. Other additional endpoints are optional, and if enabled, they simply add features to your taste.

The combination of all these data types is called the `domain` of the application in the context of TimeMap.

#### Required endpoints

1. Events: incidents to be mapped in time and space are called `events`. They must include the following fields:

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
    "tags": "",
    "category": ""
  },
  {}
]

```

Events can have zero, one or multiple tags (comma-separated in one single string), but MUST have one, and only one, category. Category properties are also a required endpoint.

2. Categories: events must be grouped in `categories`. All `events` must contain one (and only one) `category` for them to be displayed in the timeline and map. They are designed to aggregate incidents, for example, according to a population group, or obtained by a type of measure. Categories can be bundled in groups.

```json
[
  {
    "category":"Category 00",
    "category_label":"Category Label",
    "group":"category_group00",
    "group_label":"Events"
  },
  {}
]
```

#### Optional endpoints

3. Tags: `events` can be tagged by multiple `tags`. These will further characterize the event, and allow to select or deselect based on them. Tags are or can be distributed in a tree-like hierarchy, and each node on the tree can be a tag, including those who are not leafs.

```json
{  
   "key":"tags",
   "children":{  
      "tag0":{  
         "key":"tag0 ",
         "children":{  
            "tag00":{  
               "key":"tag00",
               "children":{  
                 "tag001":{  
                    "key":"tag001",
                    "children":{}
                 }
               }
            },
            "tag01":{  
               "key":"tag01",
               "children":{}
            },            
         }
      },
      "tag1":{  
         "key":"tag1",
         "children":{  
            "tag10":{  
               "key":"tag10",
               "children":{}
            }
         }
      },
   }
}

```

4. Sites: sites are labels on the map, aiming to highlight particularly relevant locations that should not be a function of time or tags.

```json
[
  {
    "id":"1",
    "description":"SITE_DESCRIPTION",
    "site":"SITE_LABEL",
    "latitude":"17.810358",
    "longitude":"-18.2251664"
  },
  {}
]
```

### Configuration

The application will require to include a few configuration settings. Configuration options are to be set in [app/config.js](app/config.js). You will find a file named `app/config.example.js` which you can copy as an example. It contains the following fields:

| Option  | Description | Type | Nullable |
| ------- | ----------- | ---- | -------- |
| title | Title of the application, display in the toolbar | String | No |
| SERVER_ROOT | Base URI for the server | String | No |
| EVENT_EXT | Endpoint for events, which will be concatenated with SERVER_ROOT | String | No |
| EVENT_DESC_ROOT | Endpoint for additional metadata for each individual event, concatenated to SERVER_ROOT | String | Yes |
| CATEGORY_EXT | Endpoint for categories, concatenated with SERVER_ROOT | String | Yes |
| TAG_TREE_EXT | Endpoint for tags, concatenated with SERVER_ROOT | String | Yes |
| SITES_EXT | Endpoint for sites, concatenated with SERVER_ROOT | String | Yes |
| MAP_ANCHOR | Geographic coordinates for original map anchor | Array of numbers | No |
| MAPBOX_TOKEN | Access token for Mapbox satellite imagery | String | No |
| features.USE_TAGS | Enable / Disable tags | boolean | No |
| features.USE_SEARCH | Enable / Disable search | boolean | No |
| features.USE_SITES | Enable / Disable sites | boolean | No |

In this configuration file you'll need to add your Mapbox token (see [here for more info](https://www.mapbox.com/help/define-access-token/)). Additionally, you'll need to replace the required endpoints by functioning ones. Finally, you'll want to initialize your application set in `MAP_ANCHOR`, as a (lat, long) pair, which determines the specific location at which the application will center itself on start.

## For developers

If you'd like to tailor the functionality of TimeMap to your use case, you can consult the [Wiki]() for more detailed documentation of the architecture of TimeMap.

## Contribute

### [Code of Conduct](CODE_OF_CONDUCT.md)

Please read our adopted [code of conduct](CODE_OF_CONDUCT.md) before contributing, so that you can understand what actions will and will not be tolerated.

### [Contributing Guide](CONTRIBUTING.md)

Read our [contributing guide](CONTRIBUTING.md) to learn about our development process, how to propose bugfixes and improvements.

## Community
If you have any questions or just want to chat, please join our team [fa_open_source](https://keybase.io/team/fa_open_source) on Keybase for community discussion. Keybase is a great platform for encrypted chat and file sharing.

## License

TimeMap is distributed under the MIT License.
