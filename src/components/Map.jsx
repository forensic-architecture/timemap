import React from 'react';
import { Portal } from 'react-portal';

import { connect } from 'react-redux'
import * as selectors from '../selectors'

import hash from 'object-hash';
import 'leaflet';

import { isNotNullNorUndefined } from '../js/utilities';

import Sites from './presentational/Map/Sites.jsx';
import Shapes from './presentational/Map/Shapes.jsx';
import Events from './presentational/Map/Events.jsx';
import SelectedEvents from './presentational/Map/SelectedEvents.jsx';
import Narratives from './presentational/Map/Narratives.jsx';
import DefsMarkers from './presentational/Map/DefsMarkers.jsx';

class Map extends React.Component {
  constructor() {
    super();
    this.projectPoint = this.projectPoint.bind(this)
    this.svgRef = React.createRef();
    this.map = null;
    this.state = {
      mapTransformX: 0,
      mapTransformY: 0
    }
    this.styleLocation = this.styleLocation.bind(this)
  }

  componentDidMount(){
    if (this.map === null) {
      this.initializeMap();
    }
  }

  componentWillReceiveProps(nextProps) {
    // Set appropriate zoom for narrative
    if (hash(nextProps.app.mapBounds) !== hash(this.props.app.mapBounds)
      && nextProps.app.mapBounds !== null) {
        this.map.fitBounds(nextProps.app.mapBounds);
    } else {
      if (hash(nextProps.app.selected) !== hash(this.props.app.selected)) {
        // Fly to first  of events selected
        const eventPoint = (nextProps.app.selected.length > 0) ? nextProps.app.selected[0] : null;

        if (eventPoint !== null && eventPoint.latitude && eventPoint.longitude) {
          this.map.setView([eventPoint.latitude, eventPoint.longitude]);
        }
      }
    }
  }

  initializeMap() {
    /**
     * Creates a Leaflet map and a tilelayer for the map background
     */
    const map =
      L.map(this.props.ui.dom.map)
        .setView(this.props.app.mapAnchor, 14)
        .setMinZoom(7)
        .setMaxZoom(18)
        .setMaxBounds([[180, -180], [-180, 180]])

    let s;
    if (process.env.MAPBOX_TOKEN && process.env.MAPBOX_TOKEN !== 'your_token') {
      s = L.tileLayer(
        `http://a.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.png?access_token=${process.env.MAPBOX_TOKEN}`
      );
    } else {
      // eslint-disable-next-line
      alert(`No mapbox token specified in config.
            Timemap does not currently support any other tiling layer,
            so you will need to sign up for one at:

            https://www.mapbox.com/

            Stop and start the development process in terminal after you have added your token to config.js`
        )
        return
    }
    s = s.addTo(map);

    map.keyboard.disable();

    map.on('move zoomend viewreset moveend', () => this.alignLayers());
    map.on('zoomstart', () => { if (this.svgRef.current !== null) this.svgRef.current.classList.add('hide') });
    map.on('zoomend', () => { if (this.svgRef.current !== null) this.svgRef.current.classList.remove('hide'); });
    window.addEventListener('resize', () => { this.alignLayers(); });

    this.map = map;
  }

  alignLayers() {
    const mapNode = document.querySelector('.leaflet-map-pane');
    if (mapNode === null) return { transformX: 0, transformY: 0 };

    // We'll get the transform of the leaflet container,
    // which will let us offset the SVG by the same quantity
    const transform = window
      .getComputedStyle(mapNode)
      .getPropertyValue('transform');

    // Offset with leaflet map transform boundaries
    this.setState({
      mapTransformX: +transform.split(',')[4],
      mapTransformY: +transform.split(',')[5].split(')')[0]
    })
  }

  projectPoint(location) {
    const latLng = new L.LatLng(location[0], location[1])
    return {
      x: this.map.latLngToLayerPoint(latLng).x + this.state.mapTransformX,
      y: this.map.latLngToLayerPoint(latLng).y + this.state.mapTransformY
    }
  }

  getClientDims() {
    const boundingClient = document.querySelector(`#${this.props.ui.dom.map}`).getBoundingClientRect();

    return {
      width: boundingClient.width,
      height: boundingClient.height
    }
  }

  renderTiles() {
    const pane = this.map.getPanes().overlayPane;
    const { width, height } = this.getClientDims();

    return (
      <Portal node={pane}>
        <svg
          ref={this.svgRef}
          width={width}
          height={height}
          style={{ transform: `translate3d(${-this.state.mapTransformX}px, ${-this.state.mapTransformY}px, 0)`}}
          className='leaflet-svg'
        >
        </svg>
      </Portal>
    );
  }

  renderSites() {
    return (
      <Sites
        sites={this.props.domain.sites}
        projectPoint={this.projectPoint}
        isEnabled={this.props.app.views.sites}
      />
    );
  }

  renderShapes() {
    return (
      <Shapes
        svg={this.svgRef.current}
        shapes={this.props.domain.shapes}
        projectPoint={this.projectPoint}
        styles={this.props.ui.shapes}
      />
    )
  }

  renderNarratives() {
    return (
      <Narratives
        svg={this.svgRef.current}
        narratives={this.props.domain.narratives}
        projectPoint={this.projectPoint}
        narrative={this.props.app.narrative}
        styles={this.props.ui.narratives}
        onSelect={this.props.methods.onSelect}
        onSelectNarrative={this.props.methods.onSelectNarrative}
      />
    );
  }

  /**
   * Determines additional styles on the <circle> for each location.
   * A location consists of an array of events (see selectors). The function
   * also has full access to the domain and redux state to derive values if
   * necessary. The function should return an array, where the value at the
   * first index is a styles object for the SVG at the location, and the value
   * at the second index is an optional function that renders additional
   * components in the <g/> div.
   */
  styleLocation(location) {
    const noEvents = location.events.length
    return [
      null,
      () => noEvents > 1 ? <text className='location-count' dx='-3' dy='4'>{noEvents}</text> : null
    ]
  }

  renderEvents() {
    return (
      <Events
        svg={this.svgRef.current}
        locations={this.props.domain.locations}
        styleLocation={this.styleLocation}
        categories={this.props.domain.categories}
        projectPoint={this.projectPoint}
        narrative={this.props.app.narrative}
        onSelect={this.props.methods.onSelect}
        onSelectNarrative={this.props.methods.onSelectNarrative}
        getCategoryColor={this.props.methods.getCategoryColor}
      />
    );
  }

  renderSelected() {
    return (
      <SelectedEvents
        svg={this.svgRef.current}
        selected={this.props.app.selected}
        projectPoint={this.projectPoint}
      />
    );
  }


  renderMarkers() {
    return (
      <Portal node={this.svgRef.current}>
        <DefsMarkers />
      </Portal>
    )
  }


  render() {
    const { isShowingSites } = this.props.app.flags
    const classes = this.props.app.narrative ? 'map-wrapper narrative-mode' : 'map-wrapper';
    const innerMap = !!this.map ? (
      <React.Fragment>
        {this.renderTiles()}
        {this.renderMarkers()}
        {isShowingSites ? this.renderSites() : null}
        {this.renderShapes()}
        {this.renderEvents()}
        {this.renderNarratives()}
        {this.renderSelected()}
      </React.Fragment>
    ) : null

    return (
      <div className={classes}>
        <div id={this.props.ui.dom.map} />
        {innerMap}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    domain: {
      locations: selectors.selectLocations(state),
      narratives: selectors.selectNarratives(state),
      categories: selectors.selectCategories(state),
      sites: selectors.getSites(state),
      shapes: selectors.getShapes(state)
    },
    app: {
      views: state.app.filters.views,
      selected: state.app.selected,
      highlighted: state.app.highlighted,
      mapAnchor: state.app.mapAnchor,
      mapBounds: state.app.filters.mapBounds,
      narrative: state.app.narrative,
      flags: {
        isShowingSites: state.app.flags.isShowingSites
      }
    },
    ui: {
      dom: state.ui.dom,
      narratives: state.ui.style.narratives,
      shapes: state.ui.style.shapes
    }
  }
}

export default connect(mapStateToProps)(Map)

