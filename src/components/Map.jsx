import React from 'react';
import hash from 'object-hash';

import MapLogic from '../js/map/map.js'

import MapDefsMarkers from './MapDefsMarkers.jsx';

class Map extends React.Component {

  constructor() {
    super();

    this.state = {
      isInitialized: false,
      map: null
    }
  }

  initializeMap() {
    /**
     * Creates a Leaflet map and a tilelayer for the map background
     * @param {string} id: DOM element to create map onto
     * @param {array} center: [lat, long] coordinates the map will be centered on
     * @param {number} zoom: zoom level
     */
    const map = L.map(this.props.mapId)
    .setView(this.props.app.mapAnchor, 14)
    .setMinZoom(10)
    .setMaxZoom(18)
    .setMaxBounds([[180, -180], [-180, 180]])

    let s
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

    this.setState({ map });
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

      let svg = pane.append('svg')
        .attr('class', 'leaflet-svg')
        .attr('width', width)
        .attr('height', height);

      let g = svg.append('g');

      this.state.map.on('zoomstart', () => {
        svg.classed('hide', true);
      });
      this.state.map.on('zoomend', () => {
        svg.classed('hide', false);
      });

      this.mapLogic = new MapLogic(this.state.map, svg, g, this.props.app, this.props.ui, this.props.methods)
      this.mapLogic.update(this.props.domain, this.props.app)

      this.setState({ isInitialized: true })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (hash(nextProps) !== hash(this.props)) {
      this.mapLogic.update(nextProps.domain, nextProps.app)
    }
  }  

  render() {
    return (
      <div id={this.props.mapId} />
    );
  }
}

export default Map;
