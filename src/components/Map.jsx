import React from 'react';
import hash from 'object-hash';

import { connect } from 'react-redux'
import * as selectors from '../selectors'

import MapLogic from '../js/map/map.js'
import MapSites from './MapSites.jsx';
import MapDefsMarkers from './MapDefsMarkers.jsx';

class Map extends React.Component {

  constructor() {
    super();

    this.state = {
      isInitialized: false,
      map: null,
      mapTransformX: 0,
      mapTransformY: 0
    }
  }

  componentDidMount(){
    if (this.state.map === null) {
      this.initializeMap();
    }
  }

  componentDidUpdate() {
    if (!this.state.isInitialized) {
      const pane = d3.select(this.state.map.getPanes().overlayPane);
      const boundingClient = d3.select(`#${this.props.mapId}`).node().getBoundingClientRect();
      const width = boundingClient.width;
      const height = boundingClient.height;

      this.svg = pane.append('svg')
        .attr('class', 'leaflet-svg')
        .attr('width', width)
        .attr('height', height);

      this.g = this.svg.append('g');

      this.state.map.on('zoomstart', () => {
        this.svg.classed('hide', true);
      });
      this.state.map.on('zoomend', () => {
        this.svg.classed('hide', false);
      });

      this.mapLogic = new MapLogic(this.state.map, this.svg, this.g, this.props.app, this.props.ui, this.props.methods)
      this.mapLogic.update(this.props.domain, this.props.app)

      this.setState({ isInitialized: true })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (hash(nextProps) !== hash(this.props)) {
      this.mapLogic.update(nextProps.domain, nextProps.app)
    }
  }  


  initializeMap() {
    /**
     * Creates a Leaflet map and a tilelayer for the map background
     * @param {string} id: DOM element to create map onto
     * @param {array} center: [lat, long] coordinates the map will be centered on
     * @param {number} zoom: zoom level
     */
    const map = 
      L.map(this.props.mapId)
        .setView(this.props.app.mapAnchor, 14)
        .setMinZoom(10)
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

    map.on("move", () => this.moveElements());

    this.setState({ map });
  }

  projectPoint(location) {
    const latLng = new L.LatLng(location[0], location[1]);
    return {
      x: this.state.map.latLngToLayerPoint(latLng).x + this.state.mapTransformX,
      y: this.state.map.latLngToLayerPoint(latLng).y + this.state.mapTransformY
    };
  }

  getSVGBoundaries() {
    const mapNode = d3.select('.leaflet-map-pane').node();
    if (mapNode === null) return { transformX: 0, transformY: 0 };

    // We'll get the transform of the leaflet container,
    // which will let us offset the SVG by the same quantity
    const transform = window
      .getComputedStyle(mapNode)
      .getPropertyValue('transform');

    // However getComputedStyle returns an awkward string of the format
    // matrix(0, 0, 1, 0, 0.56523, 123123), hence this awkwardness
    return {
      transformX: +transform.split(',')[4],
      transformY: +transform.split(',')[5].split(')')[0]
    }
  }

  updateSVG() {
    const boundingClient = d3.select(`#${this.props.mapId}`).node().getBoundingClientRect();

    let WIDTH = boundingClient.width;
    let HEIGHT = boundingClient.height;

    // Offset with leaflet map transform boundaries
    const { transformX, transformY } = this.getSVGBoundaries();
    
    this.setState({
      mapTransformX: transformX,
      mapTransformY: transformY
    })

    /*this.svg.attr('width', WIDTH)
      .attr('height', HEIGHT)
      .attr('style', `left: ${-transformX}px; top: ${-transformY}px`);

    this.g.selectAll('.location').attr('transform', (d) => {
      const newPoint = projectPoint([+d.latitude, +d.longitude]);
      return `translate(${newPoint.x},${newPoint.y})`;
    });*/
  }

  moveElements() {
    this.updateSVG();
  }

  renderSites() {
    if (this.state.isInitialized) {
      return (
        <MapSites
          sites={this.props.domain.sites}
          map={this.state.map}
          mapTransformX={this.state.mapTransformX}
          mapTransformY={this.state.mapTransformY}
          isEnabled={this.props.app.views.sites}
        />
      );
    }
    return '';
  }

  render() {
    const classes = this.props.app.narrative ? 'map-wrapper narrative-mode' : 'map-wrapper';
    return (
      <div className={classes}>
        <div id={this.props.mapId} />
        {this.renderSites()}
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
      sites: selectors.getSites(state)
    },
    app: {
      views: state.app.filters.views,
      selected: state.app.selected,
      highlighted: state.app.highlighted,
      mapAnchor: state.app.mapAnchor,
      narrative: state.app.narrative
    },
    ui: {
      dom: state.ui.dom,
      narratives: state.ui.style.narratives
    }
  }
}

export default connect(mapStateToProps)(Map)

