import {
  areEqual,
  isNotNullNorUndefined
} from '../utilities';
import hash from 'object-hash';
import 'leaflet-polylinedecorator';

export default function(lMap, svg, g, newApp, ui, methods) {

  const domain = {
    locations: [],
    narratives: [],
    categories: [],
  }
  const app = {
    selected: [],
    highlighted: null,
    narrative: null,
    views: Object.assign({}, newApp.views),
  }

  const getCategoryColor = methods.getCategoryColor;

  // Icons for markPoint flags (a yellow ring around a location)
  const eventCircleMarkers = {};

  function projectPoint(location) {
    const latLng = new L.LatLng(location[0], location[1]);
    return {
      x: lMap.latLngToLayerPoint(latLng).x + getSVGBoundaries().transformX,
      y: lMap.latLngToLayerPoint(latLng).y + getSVGBoundaries().transformY
    };
  }

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

    g.selectAll('.location').attr('transform', (d) => {
      const newPoint = projectPoint([+d.latitude, +d.longitude]);
      return `translate(${newPoint.x},${newPoint.y})`;
    });
  }

  lMap.on("zoomend viewreset moveend", updateSVG);

  /**
   * Returns latitud / longitude
   * @param {Object} eventPoint: data for an evenPoint - time, loc, tags, etc
   */
  function getEventLocation(eventPoint) {
    return {
      latitude: +eventPoint.location.latitude,
      longitude: +eventPoint.location.longitude,
    };
  }

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

  /*
   * RENDERING FUNCTIONS
   */

  function getLocationEventsDistribution(location) {
    const eventCount = {};
    const categories = domain.categories;

    categories.forEach(cat => {
      eventCount[cat.category] = 0
    });

    location.events.forEach((event) => {;
      eventCount[event.category] += 1;
    });

    let i = 0;
    const events = [];

    while (i < categories.length) {
      let _eventsCount = eventCount[categories[i].category];
      for (let j = i + 1; j < categories.length; j++) {
        _eventsCount += eventCount[categories[j].category];
      }
      events.push(_eventsCount);
      i++;
    }
    return events;
  }

  /**
   * Clears existing event layer
   * Renders all events as markers
   * Adds eventlayer to map
   */
  function renderEvents() {
    const locationsDom = g.selectAll('.location')
      .data(domain.locations, d => d.id)

    locationsDom
      .exit()
      .remove();

    locationsDom
      .enter().append('g')
      .attr('class', 'location')
      .attr('transform', (d) => {
        const newPoint = projectPoint([+d.latitude, +d.longitude]);
        return `translate(${newPoint.x},${newPoint.y})`;
      })
      .on('click', (location) => {
        methods.onSelect(location.events);
      });

    const eventsDom = g.selectAll('.location')
      .selectAll('.location-event-marker')
      .data((d, i) => getLocationEventsDistribution(domain.locations[i]))

    eventsDom
      .exit()
      .attr('r', 0)
      .remove();

    eventsDom
      .transition()
      .duration(500)
      .attr('r', d => (d) ? Math.sqrt(16 * d) + 3 : 0);

    eventsDom
      .enter().append('circle')
      .attr('class', 'location-event-marker')
      .style('fill', (d, i) => getCategoryColor(domain.categories[i].category))
      .transition()
      .duration(500)
      .attr('r', d => (d) ? Math.sqrt(16 * d) + 3 : 0);

    eventsDom.selectAll('.location-event-marker')
      .style('fill-opacity', '0.1 !important');
  }

   const getCoords = (d) => {
     d.LatLng = new L.LatLng(+d.latitude, +d.longitude);
     return {
       x: lMap.latLngToLayerPoint(d.LatLng).x,
       y: lMap.latLngToLayerPoint(d.LatLng).y
     }
   }

 

  function getMarker (d) {
    if (!d || app.narrative === null) return 'none';
    if (d.id === app.narrative.id) return 'url(#arrow)';
    return 'url(#arrow-off)';
  }

 
  /**
   * Updates displayable data on the map: events, coevents and paths
   * @param {Object} domain: object of arrays of events, coevs, attacks, paths, sites
   */
  function update(newDomain, newApp) {
    updateSVG();
    const isNewDomain = (hash(domain) !== hash(newDomain));
    const isNewAppProps = (hash(app) !== hash(newApp));

    if (isNewDomain) {
      domain.locations = newDomain.locations;
      domain.categories = newDomain.categories;
    }

    if (isNewAppProps) {
      app.views = newApp.views;
      app.selected = newApp.selected;
      app.highlighted = newApp.highlighted;
      app.mapAnchor = newApp.mapAnchor;
      app.narrative = newApp.narrative;
    }

    if (isNewDomain || isNewAppProps) renderDomain();
    if (isNewAppProps) renderSelectedAndHighlight();
  }

  /**
  * Renders events on the map: takes data, and enters, updates and exits
  */
  function renderDomain () {
    renderEvents();
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
