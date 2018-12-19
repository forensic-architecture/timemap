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
    sites: []
  }
  const app = {
    selected: [],
    highlighted: null,
    narrative: null,
    views: Object.assign({}, newApp.views),
  }

  const getCategoryColor = methods.getCategoryColor;
  const narrativeProps = ui.narratives;

  // Initialize layer
  const sitesLayer = L.layerGroup();

  // Icons for markPoint flags (a yellow ring around a location)
  const eventCircleMarkers = {};

  // Styles for elements in map
  const settingsSiteLabel = {
    className: 'site-label',
    opacity: 1,
    permanent: true,
    direction: 'top',
  };

  function projectPoint(location) {
    const latLng = new L.LatLng(location[0], location[1]);
    return {
      x: lMap.latLngToLayerPoint(latLng).x + getSVGBoundaries().transformX,
      y: lMap.latLngToLayerPoint(latLng).y + getSVGBoundaries().transformY
    };
  }

  function getSVGBoundaries() {
    const mapNode = d3.select('.leaflet-map-pane').node();

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

    svg.selectAll('.narrative')
      .each((g, i, nodes) => { return updateNarrativeSteps(g, i, nodes); });
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

  // NB: is this a function to be removed for future features?
  function renderSites() {
    sitesLayer.clearLayers();
    lMap.removeLayer(sitesLayer);

    // Create a label for each attack site, persistent across filtering
    if (app.views.sites) {
      domain.sites.forEach((site) => {
        if (isNotNullNorUndefined(site)) {
          // Create an invisible marker for each site label
          const siteMarker = L.circleMarker([+site.latitude, +site.longitude], {
            radius: 0,
            stroke: 0
          });

          siteMarker.bindTooltip(site.site, settingsSiteLabel).openTooltip();

          // Add this one attack marker to group attack layer
          sitesLayer.addLayer(siteMarker);
        }
      });

      lMap.addLayer(sitesLayer);
    }
  }


   const getCoords = (d) => {
     d.LatLng = new L.LatLng(+d.latitude, +d.longitude);
     return {
       x: lMap.latLngToLayerPoint(d.LatLng).x,
       y: lMap.latLngToLayerPoint(d.LatLng).y
     }
   }

 /**
  * Clears existing narrative layer
  * Renders all narrativ as paths
  * Adds eventlayer to map
  */

  function getNarrativeStyle(narrativeId) {
    const styleName = narrativeId && narrativeId in narrativeProps
      ? narrativeId
      : 'default';
    return narrativeProps[styleName];
  }

  function getMarker (d) {
    if (!d || app.narrative === null) return 'none';
    if (d.id === app.narrative.id) return 'url(#arrow)';
    return 'url(#arrow-off)';
  }

  function renderNarratives() {
    const narrativesDom = svg.selectAll('.narrative')
      .data((app.narrative !== null) ? domain.narratives : [])

    narrativesDom
      .exit()
      .remove();

    if (app.narrative !== null) {
      d3.selectAll('#arrow path')
        .style('fill', getNarrativeStyle(app.narrative.id).stroke);
    }

    const narrativesEnter = narrativesDom
      .enter().append('g')
      .attr('id', d => 'narrative-' + d.id)
      .attr('class', 'narrative')

    narrativesDom.selectAll('.narrative')
      .each((g, i, nodes) => { return updateNarrativeSteps(g, i, nodes); });
  }

  function updateNarrativeSteps(g, i, nodes) {
      const n = d3.select(nodes[i]).data()[0];
      const allsteps = n.steps.slice();
      allsteps.push(n.steps[n.steps.length - 1]);

      const steps = d3.select(nodes[i]).selectAll('.narrative-step')
          .data(n.steps)

      steps.enter().append('line')
        .attr('class', 'narrative-step')
          .attr('x1', d => getCoords(d).x + getSVGBoundaries().transformX)
          .attr('x2', (d, j) => { return getCoords(allsteps[j + 1]).x + getSVGBoundaries().transformX; })
          .attr('y1', d => getCoords(d).y + getSVGBoundaries().transformY)
          .attr('y2', (d, j) => { return getCoords(allsteps[j + 1]).y + getSVGBoundaries().transformY; })
          .style('stroke-width', d => {
            if (!d) return 0;
            const styleProps = getNarrativeStyle(n.id);
            return styleProps.strokeWidth;
          })
          .style('stroke-dasharray', d => {
            if (!d) return 'none';
            const styleProps = getNarrativeStyle(n.id);
            return (styleProps.style === 'dotted') ? "2px 5px" : 'none';
          })
          .style('stroke', d => {
            if (!d || app.narrative === null) return 'none';
            const styleProps = getNarrativeStyle(n.id);
            return styleProps.stroke;
          })
          .style('stroke-opacity', d => {
            if (app.narrative === null) return 0;
            if (!d || d.id !== app.narrative.id) return 0.2;
            return 1;
          })
          .attr('marker-start', (d, j) => !j ? getMarker(n) :  'none')
          .attr('marker-end', getMarker(n))
          .attr('mid-marker', getMarker(n))
          .on('click', () => methods.onSelectNarrative(n) )

      steps
          .attr('x1', d => getCoords(d).x + getSVGBoundaries().transformX)
          .attr('x2', (d, j) => { return getCoords(allsteps[j + 1]).x + getSVGBoundaries().transformX; })
          .attr('y1', d => getCoords(d).y + getSVGBoundaries().transformY)
          .attr('y2', (d, j) => { return getCoords(allsteps[j + 1]).y + getSVGBoundaries().transformY; })
          .style('stroke-width', d => {
            if (!d) return 0;
            const styleProps = getNarrativeStyle(n.id);
            return styleProps.strokeWidth;
          })
          .style('stroke-dasharray', d => {
            if (!d) return 'none';
            const styleProps = getNarrativeStyle(n.id);
            return (styleProps.style === 'dotted') ? "2px 5px" : 'none';
          })
          .style('stroke', d => {
            if (!d || app.narrative === null) return 'none';
            const styleProps = getNarrativeStyle(n.id);
            return styleProps.stroke;
          })
          .style('stroke-opacity', d => {
            if (app.narrative === null) return 0;
            if (!d || n.id !== app.narrative.id) return 0.2;
            return 1;
          })
          .attr('marker-start', (d, j) => !j ? getMarker(n) :  'none')
          .attr('marker-end', getMarker(n))
          .attr('mid-marker', getMarker(n))

      steps
        .exit()
        .remove();
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
      domain.narratives = newDomain.narratives;
      domain.categories = newDomain.categories;
      domain.sites = newDomain.sites;
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
    renderSites();
    renderNarratives();
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
