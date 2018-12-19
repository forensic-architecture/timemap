import {
  areEqual,
  isNotNullNorUndefined
} from '../utilities';
import hash from 'object-hash';
import 'leaflet-polylinedecorator';

export default function(lMap, svg, g, newApp, ui, methods) {

  const app = {
    selected: [],
    highlighted: null,
  }

  // Icons for markPoint flags (a yellow ring around a location)
  const eventCircleMarkers = {};

  function getSVGBoundaries() {
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

  function updateSVG() {
    const boundingClient = d3.select(`#${ui.dom.map}`).node().getBoundingClientRect();

    let WIDTH = boundingClient.width;
    let HEIGHT = boundingClient.height;

    // Offset with leaflet map transform boundaries
    const { transformX, transformY } = getSVGBoundaries();

    svg.attr('width', WIDTH)
      .attr('height', HEIGHT)
      .attr('style', `left: ${-transformX}px; top: ${-transformY}px`);
  }

  lMap.on("zoomend viewreset moveend", updateSVG);


  /*
   * INTERACTIVE FUNCTIONS
   */

  /**
   * Removes the circular ring to mark a particular location
   */
  function unmarkPoint() {
    Object.keys(eventCircleMarkers).forEach(markerId => {
      lMap.removeLayer(eventCircleMarkers[markerId]);
      delete eventCircleMarkers[markerId];
    });
  }

  /**
   * Makes a circular ring mark in one particular location at a time
   * @param {object} location object, with lat and long
   */
  function renderSelected() {
    unmarkPoint();
    app.selected.forEach(eventPoint => {
      if (isNotNullNorUndefined(eventPoint) && isNotNullNorUndefined(eventPoint.location)) {
        if (eventPoint.latitude && eventPoint.latitude !== "" && eventPoint.longitude && eventPoint.longitude !== "") {
          const location = new L.LatLng(eventPoint.latitude, eventPoint.longitude);
          eventCircleMarkers[eventPoint.id] = L.circleMarker(location, {
            radius: 32,
            fill: false,
            color: '#ffffff',
            weight: 3,
            lineCap: '',
            dashArray: '5,2'
          });
          eventCircleMarkers[eventPoint.id].addTo(lMap);
        }
      }
    })
  }

  function renderHighlighted() {
    // Fly to first of events selected
    const eventPoint = (app.selected.length > 0) ? app.selected[0] : null;
    if (isNotNullNorUndefined(eventPoint) && isNotNullNorUndefined(eventPoint.location)) {
      if (eventPoint.latitude && eventPoint.longitude) {
        const location = new L.LatLng(eventPoint.latitude, eventPoint.longitude);
        lMap.flyTo(location);
      }
    }
  }
 
  /**
   * Updates displayable data on the map: events, coevents and paths
   */
  function update(newApp) {
    updateSVG();
    const isNewAppProps = (hash(app) !== hash(newApp));

    if (isNewAppProps) {
      app.selected = newApp.selected;
      app.highlighted = newApp.highlighted;
    }

    if (isNewAppProps) renderSelectedAndHighlight();
  }

  function renderSelectedAndHighlight () {
    renderSelected();
    renderHighlighted();
  }

  /**
   * Expose only relevant functions
   */
  return {
    update
  };
}
