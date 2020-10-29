/* global L, Event */
import React from 'react'
import { Portal } from 'react-portal'
import Supercluster from 'supercluster'

import { connect } from 'react-redux'
import * as selectors from '../selectors'

import 'leaflet'

import Sites from './presentational/Map/Sites.jsx'
import Shapes from './presentational/Map/Shapes.jsx'
import Events from './presentational/Map/Events.jsx'
import Clusters from './presentational/Map/Clusters.jsx'
import SelectedEvents from './presentational/Map/SelectedEvents.jsx'
import Narratives from './presentational/Map/Narratives'
import DefsMarkers from './presentational/Map/DefsMarkers.jsx'
import LoadingOverlay from '../components/Overlay/Loading'

import { mapClustersToLocations, isIdentical, isLatitude, isLongitude, calculateTotalClusterPoints, calcClusterSize } from '../common/utilities'

// NB: important constants for map, TODO: make statics
const supportedMapboxMap = ['streets', 'satellite']
const defaultToken = 'your_token'

class Map extends React.Component {
  constructor () {
    super()
    this.projectPoint = this.projectPoint.bind(this)
    this.onClusterSelect = this.onClusterSelect.bind(this)
    this.loadClusterData = this.loadClusterData.bind(this)
    this.getClusterChildren = this.getClusterChildren.bind(this)
    this.svgRef = React.createRef()
    this.map = null
    this.superclusterIndex = null
    this.state = {
      mapTransformX: 0,
      mapTransformY: 0,
      indexLoaded: false,
      clusters: []
    }
    this.styleLocation = this.styleLocation.bind(this)
  }

  componentDidMount () {
    if (this.map === null) {
      this.initializeMap()
    }
    window.dispatchEvent(new Event('resize'))
  }

  componentWillReceiveProps (nextProps) {
    if (!isIdentical(nextProps.domain.locations, this.props.domain.locations)) {
      this.loadClusterData(nextProps.domain.locations)
    }
    // Set appropriate zoom for narrative
    const { bounds } = nextProps.app.map
    if (!isIdentical(bounds, this.props.app.map.bounds) &&
      bounds !== null) {
      this.map.fitBounds(bounds)
    } else {
      if (!isIdentical(nextProps.app.selected, this.props.app.selected)) {
        // Fly to first  of events selected
        const eventPoint = (nextProps.app.selected.length > 0) ? nextProps.app.selected[0] : null

        if (eventPoint !== null && eventPoint.latitude && eventPoint.longitude) {
          // this.map.setView([eventPoint.latitude, eventPoint.longitude])
          this.map.setView([eventPoint.latitude, eventPoint.longitude], this.map.getZoom(), {
            'animate': true,
            'pan': {
              'duration': 0.7
            }
          })
        }
      }
    }
  }

  initializeMap () {
    /**
     * Creates a Leaflet map and a tilelayer for the map background
     */
    const { map: mapConfig, cluster: clusterConfig } = this.props.app

    const map =
      L.map(this.props.ui.dom.map)
        .setView(mapConfig.anchor, mapConfig.startZoom)
        .setMinZoom(mapConfig.minZoom)
        .setMaxZoom(mapConfig.maxZoom)
        .setMaxBounds(mapConfig.maxBounds)

    // Initialize supercluster index
    this.superclusterIndex = new Supercluster(clusterConfig)

    let firstLayer

    if ((supportedMapboxMap.indexOf(this.props.ui.tiles) !== -1) && process.env.MAPBOX_TOKEN && process.env.MAPBOX_TOKEN !== defaultToken) {
      firstLayer = L.tileLayer(
        `http://a.tiles.mapbox.com/v4/mapbox.${this.props.ui.tiles}/{z}/{x}/{y}@2x.png?access_token=${process.env.MAPBOX_TOKEN}`
      )
    } else if (process.env.MAPBOX_TOKEN && process.env.MAPBOX_TOKEN !== defaultToken) {
      firstLayer = L.tileLayer(
        `http://a.tiles.mapbox.com/styles/v1/${this.props.ui.tiles}/tiles/{z}/{x}/{y}?access_token=${process.env.MAPBOX_TOKEN}`
      )
    } else {
      firstLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      )
    }
    firstLayer.addTo(map)

    map.keyboard.disable()
    map.zoomControl.remove()

    map.on('moveend', () => {
      this.updateClusters()
      this.alignLayers()
    })

    map.on('move zoomend viewreset', () => this.alignLayers())
    map.on('zoomstart', () => { if (this.svgRef.current !== null) this.svgRef.current.classList.add('hide') })
    map.on('zoomend', () => { if (this.svgRef.current !== null) this.svgRef.current.classList.remove('hide') })
    window.addEventListener('resize', () => { this.alignLayers() })

    this.map = map
  }

  getMapDetails () {
    const bounds = this.map.getBounds()
    const bbox = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()]
    const zoom = this.map.getZoom()
    return [bbox, zoom]
  }

  updateClusters () {
    const [bbox, zoom] = this.getMapDetails()
    if (this.superclusterIndex && this.state.indexLoaded) {
      this.setState({
        clusters: this.superclusterIndex.getClusters(bbox, zoom)
      })
    }
  }

  loadClusterData (locations) {
    if (locations && locations.length > 0 && this.superclusterIndex) {
      const convertedLocations = locations.reduce((acc, loc) => {
        const { longitude, latitude } = loc
        const validCoordinates = isLatitude(latitude) && isLongitude(longitude)
        if (validCoordinates) {
          const feature = {
            type: 'Feature',
            properties: {
              cluster: false,
              id: loc.label
            },
            geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            }
          }
          acc.push(feature)
        }
        return acc
      }, [])
      this.superclusterIndex.load(convertedLocations)
      this.setState({ indexLoaded: true }, () => {
        this.updateClusters()
      })
    } else {
      this.setState({ clusters: [] })
    }
  }

  getClusterChildren (clusterId) {
    if (this.superclusterIndex) {
      try {
        const children = this.superclusterIndex.getLeaves(clusterId, Infinity, 0)
        return mapClustersToLocations(children, this.props.domain.locations)
      } catch (err) {
        return []
      }
    }
    return []
  }

  getSelectedClusters () {
    const { selected } = this.props.app
    const selectedIds = selected.map(sl => sl.id)

    if (this.state.clusters && this.state.clusters.length > 0) {
      return this.state.clusters.reduce((acc, cl) => {
        if (cl.properties.cluster) {
          const children = this.getClusterChildren(cl.properties.cluster_id)
          if (children && children.length > 0) {
            children.forEach(child => {
              const clusterPresent = acc.findIndex(item => item.id === cl.id) >= 0
              if (selectedIds.includes(child.id) && !clusterPresent) {
                acc.push(cl)
              }
            })
          }
        }
        return acc
      }, [])
    }
    return []
  }

  alignLayers () {
    const mapNode = document.querySelector('.leaflet-map-pane')
    if (mapNode === null) return { transformX: 0, transformY: 0 }

    // We'll get the transform of the leaflet container,
    // which will let us offset the SVG by the same quantity
    const transform = window
      .getComputedStyle(mapNode)
      .getPropertyValue('transform')

    // Offset with leaflet map transform boundaries
    this.setState({
      mapTransformX: +transform.split(',')[4],
      mapTransformY: +transform.split(',')[5].split(')')[0]
    })
  }

  projectPoint (location) {
    const latLng = new L.LatLng(location[0], location[1])
    return {
      x: this.map.latLngToLayerPoint(latLng).x + this.state.mapTransformX,
      y: this.map.latLngToLayerPoint(latLng).y + this.state.mapTransformY
    }
  }

  onClusterSelect ({ id, latitude, longitude }) {
    const expansionZoom = Math.max(this.superclusterIndex.getClusterExpansionZoom(parseInt(id)), this.superclusterIndex.options.minZoom)
    const zoomLevelsToSkip = 2
    const zoomToFly = Math.max(expansionZoom + zoomLevelsToSkip, this.props.app.cluster.maxZoom)
    this.map.flyTo(new L.LatLng(latitude, longitude), zoomToFly)
  }

  getClientDims () {
    const boundingClient = document.querySelector(`#${this.props.ui.dom.map}`).getBoundingClientRect()

    return {
      width: boundingClient.width,
      height: boundingClient.height
    }
  }

  renderTiles () {
    const pane = this.map.getPanes().overlayPane
    const { width, height } = this.getClientDims()

    return this.map ? (
      <Portal node={pane}>
        <svg
          ref={this.svgRef}
          width={width}
          height={height}
          style={{ transform: `translate3d(${-this.state.mapTransformX}px, ${-this.state.mapTransformY}px, 0)` }}
          className='leaflet-svg'
        />
      </Portal>
    ) : null
  }

  renderSites () {
    return (
      <Sites
        sites={this.props.domain.sites}
        projectPoint={this.projectPoint}
        isEnabled={this.props.app.views.sites}
      />
    )
  }

  renderShapes () {
    return (
      <Shapes
        svg={this.svgRef.current}
        shapes={this.props.domain.shapes}
        projectPoint={this.projectPoint}
        styles={this.props.ui.shapes}
      />
    )
  }

  renderNarratives () {
    const hasNarratives = this.props.domain.narratives.length > 0
    return (
      <Narratives
        svg={this.svgRef.current}
        narratives={hasNarratives ? this.props.domain.narratives : [this.props.app.narrative]}
        projectPoint={this.projectPoint}
        narrative={this.props.app.narrative}
        styles={this.props.ui.narratives}
        onSelectNarrative={this.props.methods.onSelectNarrative}
        features={this.props.features}
      />
    )
  }

  /**
   * Determines additional styles on the <circle> for each location.
   * A location consists of an array of events (see selectors). The function
   * also has full access to the domain and redux state to derive values if
   * necessary. The function should return an array, where the value at the
   * first index is a styles object for the SVG at the location, and the value
   * at the second index is an optional additional component that renders in
   * the <g/> div.
   */
  styleLocation (location) {
    return [null, null]
  }

  styleCluster (cluster) {
    return [null, null]
  }

  renderEvents () {
    /*
    Uncomment below to filter out the locations already present in a cluster.
    Leaving these lines commented out renders all the locations on the map, regardless of whether or not they are clustered
    */

    const individualClusters = this.state.clusters.filter(cl => !cl.properties.cluster)
    const filteredLocations = mapClustersToLocations(individualClusters, this.props.domain.locations)
    return (
      <Events
        svg={this.svgRef.current}
        events={this.props.domain.events}
        locations={filteredLocations}
        // locations={this.props.domain.locations}
        styleLocation={this.styleLocation}
        categories={this.props.domain.categories}
        projectPoint={this.projectPoint}
        selected={this.props.app.selected}
        narrative={this.props.app.narrative}
        onSelect={this.props.methods.onSelect}
        getCategoryColor={this.props.methods.getCategoryColor}
        eventRadius={this.props.ui.eventRadius}
        coloringSet={this.props.app.coloringSet}
        filterColors={this.props.ui.filterColors}
        features={this.props.features}
      />
    )
  }

  renderClusters () {
    const allClusters = this.state.clusters.filter(cl => cl.properties.cluster)
    return (
      <Clusters
        svg={this.svgRef.current}
        styleCluster={this.styleCluster}
        projectPoint={this.projectPoint}
        clusters={allClusters}
        isRadial={this.props.ui.radial}
        onSelect={this.onClusterSelect}
        coloringSet={this.props.app.coloringSet}
        getClusterChildren={this.getClusterChildren}
        filterColors={this.props.ui.filterColors}
      />
    )
  }

  renderSelected () {
    const selectedClusters = this.getSelectedClusters()
    const totalMarkers = []

    this.props.app.selected.forEach(s => {
      const { latitude, longitude } = s
      totalMarkers.push({
        latitude,
        longitude,
        radius: this.props.ui.eventRadius
      })
    })

    const totalClusterPoints = calculateTotalClusterPoints(this.state.clusters)

    selectedClusters.forEach(cl => {
      if (cl.properties.cluster) {
        const { coordinates } = cl.geometry
        totalMarkers.push({
          latitude: String(coordinates[1]),
          longitude: String(coordinates[0]),
          radius: calcClusterSize(cl.properties.point_count, totalClusterPoints)
        })
      }
    })

    return (
      <SelectedEvents
        svg={this.svgRef.current}
        selected={totalMarkers}
        projectPoint={this.projectPoint}
        styles={this.props.ui.mapSelectedEvents}
      />
    )
  }

  renderMarkers () {
    return (
      <Portal node={this.svgRef.current}>
        <DefsMarkers />
      </Portal>
    )
  }

  render () {
    const { isShowingSites, isFetchingDomain } = this.props.app.flags
    const classes = this.props.app.narrative ? 'map-wrapper narrative-mode' : 'map-wrapper'
    const innerMap = this.map ? (
      <React.Fragment>
        {this.renderTiles()}
        {this.renderMarkers()}
        {isShowingSites ? this.renderSites() : null}
        {this.renderShapes()}
        {this.renderNarratives()}
        {this.renderEvents()}
        {this.renderClusters()}
        {this.renderSelected()}
      </React.Fragment>
    ) : null

    return (
      <div className={classes}
        onKeyDown={this.props.onKeyDown}
        tabIndex='0'
      >
        <div id={this.props.ui.dom.map} />
        <LoadingOverlay
          isLoading={this.props.app.loading || isFetchingDomain}
          ui={isFetchingDomain}
          language={this.props.app.language}
        />
        {innerMap}
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    domain: {
      locations: selectors.selectLocations(state),
      narratives: selectors.selectNarratives(state),
      categories: selectors.getCategories(state),
      sites: selectors.selectSites(state),
      shapes: selectors.selectShapes(state)
    },
    app: {
      views: state.app.associations.views,
      selected: selectors.selectSelected(state),
      highlighted: state.app.highlighted,
      map: state.app.map,
      cluster: state.app.cluster,
      language: state.app.language,
      loading: state.app.loading,
      narrative: state.app.associations.narrative,
      coloringSet: state.app.associations.coloringSet,
      flags: {
        isShowingSites: state.app.flags.isShowingSites,
        isFetchingDomain: state.app.flags.isFetchingDomain
      }
    },
    ui: {
      tiles: state.ui.tiles,
      dom: state.ui.dom,
      narratives: state.ui.style.narratives,
      mapSelectedEvents: state.ui.style.selectedEvents,
      shapes: state.ui.style.shapes,
      eventRadius: state.ui.eventRadius,
      radial: state.ui.style.clusters.radial,
      filterColors: state.ui.coloring.colors
    },
    features: selectors.getFeatures(state)
  }
}

export default connect(mapStateToProps)(Map)
