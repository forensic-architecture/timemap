/* global L */
import React from 'react'
import { Portal } from 'react-portal'

import { connect } from 'react-redux'
import * as selectors from '../selectors'

import hash from 'object-hash'
import 'leaflet'

import Sites from './presentational/Map/Sites.jsx'
import Shapes from './presentational/Map/Shapes.jsx'
import Events from './presentational/Map/Events.jsx'
import SelectedEvents from './presentational/Map/SelectedEvents.jsx'
import Narratives from './presentational/Map/Narratives'
import DefsMarkers from './presentational/Map/DefsMarkers.jsx'

// NB: important constants for map, TODO: make statics
const supportedMapboxMap = ['streets', 'satellite']
const defaultToken = 'your_token'

class Map extends React.Component {
  constructor () {
    super()
    this.projectPoint = this.projectPoint.bind(this)
    this.svgRef = React.createRef()
    this.map = null
    this.state = {
      mapTransformX: 0,
      mapTransformY: 0
    }
    this.styleLocation = this.styleLocation.bind(this)
  }

  componentDidMount () {
    if (this.map === null) {
      this.initializeMap()
    }
  }

  componentWillReceiveProps (nextProps) {
    // Set appropriate zoom for narrative
    const { bounds } = nextProps.app.map
    if (hash(bounds) !== hash(this.props.app.map.bounds) &&
      bounds !== null) {
      this.map.fitBounds(bounds)
    } else {
      if (hash(nextProps.app.selected) !== hash(this.props.app.selected)) {
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
    const { map: mapConf } = this.props.app
    const map =
      L.map(this.props.ui.dom.map)
        .setView(mapConf.anchor, mapConf.startZoom)
        .setMinZoom(mapConf.minZoom)
        .setMaxZoom(mapConf.maxZoom)
        .setMaxBounds(mapConf.maxBounds)

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

    map.on('move zoomend viewreset moveend', () => this.alignLayers())
    map.on('zoomstart', () => { if (this.svgRef.current !== null) this.svgRef.current.classList.add('hide') })
    map.on('zoomend', () => { if (this.svgRef.current !== null) this.svgRef.current.classList.remove('hide') })
    window.addEventListener('resize', () => { this.alignLayers() })

    this.map = map
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

  renderEvents () {
    return (
      <Events
        svg={this.svgRef.current}
        events={this.props.domain.events}
        locations={this.props.domain.locations}
        styleLocation={this.styleLocation}
        categories={this.props.domain.categories}
        projectPoint={this.projectPoint}
        selected={this.props.app.selected}
        narrative={this.props.app.narrative}
        onSelect={this.props.methods.onSelect}
        getCategoryColor={this.props.methods.getCategoryColor}
        eventRadius={this.props.ui.eventRadius}
      />
    )
  }

  renderSelected () {
    return (
      <SelectedEvents
        svg={this.svgRef.current}
        selected={this.props.app.selected}
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
    const { isShowingSites } = this.props.app.flags
    const classes = this.props.app.narrative ? 'map-wrapper narrative-mode' : 'map-wrapper'
    const innerMap = this.map ? (
      <React.Fragment>
        {this.renderTiles()}
        {this.renderMarkers()}
        {isShowingSites ? this.renderSites() : null}
        {this.renderShapes()}
        {this.renderNarratives()}
        {this.renderEvents()}
        {this.renderSelected()}
      </React.Fragment>
    ) : null

    return (
      <div className={classes}
        onKeyDown={this.props.onKeyDown}
        tabIndex='0'
      >
        <div id={this.props.ui.dom.map} />
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
      views: state.app.filters.views,
      selected: selectors.selectSelected(state),
      highlighted: state.app.highlighted,
      map: state.app.map,
      narrative: state.app.narrative,
      flags: {
        isShowingSites: state.app.flags.isShowingSites
      }
    },
    ui: {
      tiles: state.ui.tiles,
      dom: state.ui.dom,
      narratives: state.ui.style.narratives,
      mapSelectedEvents: state.ui.style.selectedEvents,
      shapes: state.ui.style.shapes,
      eventRadius: state.ui.eventRadius
    },
    features: selectors.getFeatures(state)
  }
}

export default connect(mapStateToProps)(Map)
