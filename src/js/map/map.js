import {
  areEqual,
  isNotNullNorUndefined
} from '../utilities';
import hash from 'object-hash';
import 'leaflet-polylinedecorator';

export default function(newApp, ui, methods) {
  let svg, g, defs;

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

    // Map Settings
  const center = newApp.mapAnchor;
  const maxBoundaries = [[180, -180], [-180, 180]];
  const zoomLevel = 14;

  // Initialize layer
  const sitesLayer = L.layerGroup();
  const pathLayer = L.layerGroup();

  // Icons for markPoint flags (a yellow ring around a location)
  const eventCircleMarkers = {};

  // Styles for elements in map
  const settingsSiteLabel = {
    className: 'site-label',
    opacity: 1,
    permanent: true,
    direction: 'top',
  };


  /**
   * Creates a Leaflet map and a tilelayer for the map background
   * @param {string} id: DOM element to create map onto
   * @param {array} center: [lat, long] coordinates the map will be centered on
   * @param {number} zoom: zoom level
   */
  function initBackgroundMap(id, zoom) {
    /* http://bl.ocks.org/sumbera/10463358 */

    const map = L.map(id)
      .setView(center, zoom)
      .setMinZoom(10)
      .setMaxZoom(18)
      .setMaxBounds(maxBoundaries)

    // NB: configure tile endpoint
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

Stop and start the development process in terminal after you have added your token to config.js`)
    return
    }
    s = s.addTo(map);

    map.keyboard.disable();
    const pane = d3.select(map.getPanes().overlayPane);
    const boundingClient = d3.select(`#${id}`).node().getBoundingClientRect();
    const width = boundingClient.width;
    const height = boundingClient.height;

    svg = pane.append('svg')
      .attr('class', 'leaflet-svg')
      .attr('width', width)
      .attr('height', height);

    g = svg.append('g');

    svg.insert('defs', 'g')
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 0 6 6')
      .attr('refX', 3)
      .attr('refY', 3)
      .attr('markerWidth', 14)
      .attr('markerHeight', 14)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,3v-3l6,3l-6,3z');

    map.on('zoomstart', () => {
      svg.classed('hide', true);
    });
    map.on('zoomend', () => {
      svg.classed('hide', false);
    });

    return map;
  }

  // Initialize leaflet map and layers for each type of data
  const lMap = initBackgroundMap(ui.dom.map, zoomLevel);

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

    const sequenceLine = d3.line()
      .x(d => getCoords(d).x + transformX)
      .y(d => getCoords(d).y + transformY);

    g.selectAll('.narrative')
      .attr('d', d => sequenceLine(d.steps));
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
    // categories.sort((a, b) => {
    //   return (+a.slice(-2) > +b.slice(-2));
    // });
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

   /*const sequenceLine = d3.line()
     .x(d => getCoords(d).x)
     .y(d => getCoords(d).y)*/

   const sequenceLine = d3.line()
     .x(d => getCoords(d).x + getSVGBoundaries().transformX)
     .y(d => getCoords(d).y + getSVGBoundaries().transformY);
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

  function renderNarratives() {
    const narrativesDom = svg.selectAll('.narrative')
      .data(domain.narratives)

    narrativesDom
      .exit()
      .remove();

    narrativesDom
      .enter().append('path')
      .attr('class', 'narrative')
      .attr('d', d => sequenceLine(d.steps))
      .style('stroke-width', d => {
        if (!d) return 0;
        const styleProps = getNarrativeStyle(d.id);
        return styleProps.strokeWidth;
      })
      .style('stroke-dasharray', d => {
        if (!d) return 'none';
        const styleProps = getNarrativeStyle(d.id);
        return (styleProps.style === 'dotted') ? "2px 5px" : 'none';
      })
      .style('stroke', d => {
        if (!d || app.narrative === null) return 'none';
        if (d.id !== app.narrative.id) return '#232323';
        const styleProps = getNarrativeStyle(d.id);
        return styleProps.stroke;
      })
      .style('stroke-opacity', d => {
        if (app.narrative === null) return 0;
        if (!d || d.id !== app.narrative.id) return 0.2;
        return 1;
      })
      .style('fill', 'none')
      .style('cursor', 'pointer')
      .on('click', d => {
        console.log(d)
      });

    narrativesDom
      .attr('d', d => sequenceLine(d.steps))
      .style('stroke', d => {
        if (!d || app.narrative === null) return 'none';
        if (d.id !== app.narrative.id) return '#232323';
        const styleProps = getNarrativeStyle(d.id);
        return styleProps.stroke;
      })
      .style('stroke-opacity', d => {
        if (app.narrative === null) return 0;
        if (!d || d.id !== app.narrative.id) return 0.2;
        return 1;
      })
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
