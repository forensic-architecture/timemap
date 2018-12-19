import { isNotNullNorUndefined } from '../utilities';
import hash from 'object-hash';
import 'leaflet-polylinedecorator';

export default function(lMap, svg, newApp, ui) {

  const app = {
    selected: [],
    highlighted: null,
  }

  // Icons for markPoint flags (a yellow ring around a location)
  const eventCircleMarkers = {};

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
    if (hash(app) !== hash(newApp)) {
      app.selected = newApp.selected;
      app.highlighted = newApp.highlighted;
      renderSelectedAndHighlight();
    }
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
