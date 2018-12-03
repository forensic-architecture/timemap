/*
  TIMELINE
  Displays events over the course of the night
  Allows brushing and selecting periods of time in it
  TODO: is it possible to express this idiomatically as React?
*/
import {
  areEqual
} from '../data/utilities';
import esLocale from '../data/es-MX.json';
import copy from '../data/copy.json';

export default function(app, ui) {
  d3.timeFormatDefaultLocale(esLocale);
  const formatterWithYear = ui.tools.formatterWithYear;
  const parser = ui.tools.parser;
  const zoomLevels = [{
      label: '3 años',
      duration: 1576800,
      active: false
    },
    {
      label: '3 meses',
      duration: 129600,
      active: false
    },
    {
      label: '3 días',
      duration: 4320,
      active: true
    },
    {
      label: '12 horas',
      duration: 720,
      active: false
    },
    {
      label: '2 horas',
      duration: 120,
      active: false
    },
    {
      label: '30 min',
      duration: 30,
      active: false
    },
    {
      label: '10 min',
      duration: 10,
      active: false
    },
  ];
  let events = [];
  let categories = [];
  let selected = [];
  let timerange = app.timerange;

  const timeFilter = app.filter;
  const select = app.select;
  const getCategoryLabel = app.getCategoryLabel;
  const getCategoryColor = app.getCategoryColor;

  // Drag behavior
  let dragPos0;
  let transitionDuration = 500;

  // Dimension of the client
  const WIDTH_CONTROLS = 180;
  const boundingClient = d3.select(`#${ui.dom.timeline}`).node().getBoundingClientRect();
  let WIDTH = boundingClient.width - WIDTH_CONTROLS;
  const HEIGHT = 140;
  const markerRadius = 15;
  // margin
  // NB: is it possible to do this with SCSS?
  // A: Maybe, although we are using it programmatically here for now
  const mg = {
    l: 120
  };

  /**
   * Create scales
   */
  const scale = {};

  scale.x = d3.scaleTime()
    .domain(timerange)
    .range([mg.l, WIDTH]);

  // calculate group step between categories
  const groupStep = (106 - 30) / categories.length;
  const groupYs = new Array(categories.length);
  groupYs.map((g, i) => {
    return 30 + i * groupStep;
  });

  scale.y = d3.scaleOrdinal()
    .domain(categories)
    .range(groupYs);

  /**
   * Initilize SVG elements and groups
   */
  const dom = {};

  dom.svg =
    d3.select(`#${ui.dom.timeline}`)
    .append('svg')
    .attr('width', WIDTH)
    .attr('height', HEIGHT);

  dom.controls =
    d3.select(`#${ui.dom.timeline}`)
    .append('svg')
    .attr('class', 'time-controls')
    .attr('width', WIDTH_CONTROLS)
    .attr('height', HEIGHT);

  /*
   * Axis group elements
   */

  dom.axis = {};

  dom.axis.x0 = dom.svg.append('g')
    .attr('transform', `translate(0, 25)`)
    .attr('class', 'axis xAxis');

  dom.axis.x1 = dom.svg.append('g')
    .attr('transform', `translate(0, 105)`)
    .attr('class', 'axis axisHourText');

  dom.axis.y = dom.svg.append('g')
    .attr('transform', `translate(${WIDTH}, 0)`)
    .attr('class', 'yAxis');

  dom.axis.boundaries = dom.svg.selectAll('.axisBoundaries')
    .data([0, 1])
    .enter().append('line')
    .attr('class', 'axisBoundaries');

  dom.axis.label0 = dom.svg.append('text')
    .attr('class', 'timeLabel0 timeLabel');

  dom.axis.label1 = dom.svg.append('text')
    .attr('class', 'timelabelF timeLabel');

  /*
   * Plottable elements
   */
  dom.dataset = dom.svg.append('g');
  dom.events = dom.dataset.append('g');

  /*
   * Time Controls
   */
  dom.forward = dom.svg.append('g').attr('class', 'time-controls-inline');
  dom.forward.append('circle');
  dom.forward.append('path');

  dom.backwards = dom.svg.append('g').attr('class', 'time-controls-inline');
  dom.backwards.append('circle');
  dom.backwards.append('path');

  dom.playGroup = dom.controls.append('g');
  dom.playGroup.append('circle');

  dom.play = dom.playGroup.append('g');
  dom.play.append('path');

  dom.pause = dom.playGroup.append('g').style('opacity', 0);
  dom.pause.append('rect');
  dom.pause.append('rect');

  dom.zooms = dom.controls.append('g');

  dom.zooms.selectAll('.zoom-level-button')
    .data(zoomLevels)
    .enter().append('text')
    .attr('class', 'zoom-level-button');

  /*
   * Initialize axis function and element group
   */
  const axis = {};

  axis.x0 =
    d3.axisBottom(scale.x)
    .ticks(10)
    .tickPadding(5)
    .tickSize(80)
    .tickFormat(d3.timeFormat('%d %b'));

  axis.x1 =
    d3.axisBottom(scale.x)
    .ticks(10)
    .tickPadding(20)
    .tickSize(0)
    .tickFormat(d3.timeFormat('%H:%M'));

  axis.y =
    d3.axisLeft(scale.y)
    .tickValues([]);

  /*
   * Setup drag behavior
   */
  const drag =
    d3.drag()
    .on('start', () => {
      d3.event.sourceEvent.stopPropagation();
      dragPos0 = d3.event.x;
      toggleTransition(false);
    })
    .on('drag', () => {
      const drag0 = scale.x.invert(dragPos0).getTime();
      const dragNow = scale.x.invert(d3.event.x).getTime();
      const timeShift = (drag0 - dragNow) / 1000;

      const newDomain0 = d3.timeSecond.offset(timerange[0], timeShift);
      const newDomainF = d3.timeSecond.offset(timerange[1], timeShift);

      scale.x.domain([newDomain0, newDomainF])
      render();
    })
    .on('end', () => {
      toggleTransition(true);
      timeFilter(scale.x.domain());
    });

  /*
   * SVG groups for marker
   */

  dom.markers = dom.svg.append('g');

  /**
   * Adapt dimensions when resizing
   */
  function getCurrentWidth() {
    return d3.select(`#${ui.dom.timeline}`).node()
      .getBoundingClientRect().width;
  }

  /**
   * Resize timeline one window resice
   */
  function addResizeListener() {
    window.addEventListener('resize', () => {
      if (d3.select(`#${ui.dom.timeline}`).node() !== null) {
        WIDTH = getCurrentWidth() - WIDTH_CONTROLS;

        dom.svg.attr('width', WIDTH);
        scale.x.range([mg.l, WIDTH]);
        axis.y.tickSize(WIDTH - mg.l);
        dom.axis.y.attr('transform', `translate(${WIDTH}, 0)`)
        render(null);
      }
    });
  }
  addResizeListener();

  /**
   * PLAY FUNCTIONALITY
   */
  function stopBrushTransition() {
    clearInterval(window.playInterval);
    isPlaying = false;
    dom.play.style('opacity', 1);
    dom.pause.style('opacity', 0);
  }

  /**
   * START PLAY SERIES OF TRANSITIONS
   */
  function playBrushTransition() {
    isPlaying = true;
    dom.play.style('opacity', 0);
    dom.pause.style('opacity', 1);
    window.playInterval = setInterval(() => {
      moveTime('forward');
    }, playDuration);
  }

  /**
   * Return which color event circle should be based on incident type
   * @param {object} eventPoint data object
   */
  function getEventPointFillColor(eventPoint) {
    return getCategoryColor(eventPoint.category);
  }

  /**
   * Given an event, get all the filtered events that happen simultaneously
   * @param {object} eventPoint: regular eventPoint data
   */
  function getAllEventsAtOnce(eventPoint) {
    const timestamp = eventPoint.timestamp;
    const categoryGroup = eventPoint.category;
    return events.filter(event => {
      return (event.timestamp === timestamp &&
        categoryGroup === event.category)
    }).map(event => event.id);
  }

  /*
   * Get y height of eventPoint, considering the ordinal Y scale
   * @param {object} eventPoint: regular eventPoint data
   */
  function getEventY(eventPoint) {
    const yGroup = eventPoint.category;
    return scale.y(yGroup);
  }

  /*
   * Get x position of eventPoint, considering the time scale
   * @param {object} eventPoint: regular eventPoint data
   */
  function getEventX(eventPoint) {
    return scale.x(parser(eventPoint.timestamp));
  }

  function getTimeScaleExtent() {
    return (scale.x.domain()[1].getTime() - scale.x.domain()[0].getTime()) / 60000;
  }

  /*
   * Given a number of minutes, calculate the width based on current scale.x
   * @param {number} minutes: number of minutes
   */
  function getWidthOfTime(minutes) {
    const allMins = getTimeScaleExtent();
    return (minutes * WIDTH) / allMins;
  }

  function highlightZoomLevel(zoom) {
    zoomLevels.forEach((level) => {
      if (level.label === zoom.label) {
        level.active = true;
      } else {
        level.active = false;
      }
    });

    dom.zooms.selectAll('text')
      .classed('active', level => level.active);
  }

  /**
   * Apply zoom level to timeline
   * @param {object} zoom: zoom level from zoomLevels
   */
  function applyZoom(zoom) {
    highlightZoomLevel(zoom);

    const extent = getTimeScaleExtent();
    const newCentralTime = d3.timeMinute.offset(scale.x.domain()[0], extent / 2);

    const domain0 = d3.timeMinute.offset(newCentralTime, -zoom.duration / 2);
    const domainF = d3.timeMinute.offset(newCentralTime, zoom.duration / 2);

    scale.x.domain([domain0, domainF]);
    timeFilter(scale.x.domain());
  }

  /**
   * Shift time range by moving forward or backwards
   * @param {String} direction: 'forward' / 'backwards'
   */
  function moveTime(direction) {
    select();
    const extent = getTimeScaleExtent();
    const newCentralTime = d3.timeMinute.offset(scale.x.domain()[0], extent / 2);

    // if forward
    let domain0 = newCentralTime;
    let domainF = d3.timeMinute.offset(newCentralTime, extent);

    // if backwards
    if (direction === 'backwards') {
      domain0 = d3.timeMinute.offset(newCentralTime, -extent);
      domainF = newCentralTime;
    }

    scale.x.domain([domain0, domainF]);
    timeFilter(scale.x.domain());
  }

  function toggleTransition(isTransition) {
    transitionDuration = (isTransition) ? 500 : 0;
  }

  /**
   * Highlight event circle on hover
   */
  function handleMouseOver() {
    d3.select(this)
      .attr('r', 7)
      .classed('mouseover', true);
  }

  /**
   * Unhighlight event when mouse out
   */
  function handleMouseOut() {
    d3.select(this)
      .attr('r', 5)
      .classed('mouseover', false);
  }

  /**
   * It automatically sets brush timeline to a domain set by the params
   */
  function updateTimeRange() {
    scale.x.domain(timerange);
    axis.x0.scale(scale.x);
    axis.x1.scale(scale.x);
  }


  /**
   * Display the current time range in the time label above the timeline
   */
  function renderTimeLabels() {
    dom.axis.label0
      .attr('x', 5)
      .attr('y', 15)
      .text(formatterWithYear(timerange[0]));

    dom.axis.label1
      .attr('x', WIDTH - 5)
      .attr('y', 15)
      .text(formatterWithYear(timerange[1]))
      .style('text-anchor', 'end');
  }

  /**
   * Makes a circular rinig mark in one particular location at a time
   * @param {object} eventPoint: object with eventPoint data (time, loc, tags)
   */
  function renderHighlight() {
    const markers = dom.markers
      .selectAll('circle')
      .data(selected);

    markers
      .enter()
      .append('circle')
      .attr('class', 'timeline-marker')
      .merge(markers)
      .attr('cy', eventPoint => getEventY(eventPoint))
      .attr('cx', eventPoint => getEventX(eventPoint))
      .attr('r', 10)
      .style('opacity', .9);

    markers.exit().remove();
  }

  /**
   * Return event circles of different groups
   */
  function renderEvents() {
    const eventsDom = dom.events
      .selectAll('.event')
      .data(events, d => d.id);

    eventsDom
      .exit()
      .remove();

    eventsDom
      .transition()
      .duration(transitionDuration)
      .attr('cx', eventPoint => getEventX(eventPoint));

    eventsDom
      .enter()
      .append('circle')
      .attr('class', 'event')
      .attr('cx', eventPoint => getEventX(eventPoint))
      .attr('cy', eventPoint => getEventY(eventPoint))
      .style('fill', eventPoint => getEventPointFillColor(eventPoint))
      .on('click', eventPoint => select(getAllEventsAtOnce(eventPoint)))
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)
      .transition()
      .delay(300)
      .duration(200)
      .attr('r', 5);
  }

  /**
   * Render axis on timeline and viewbox boundaries
   */
  function renderAxis() {
    dom.axis.x0
      .call(drag);

    dom.axis.x1
      .call(drag);

    dom.axis.x0
      .transition()
      .duration(transitionDuration)
      .call(axis.x0);

    dom.axis.x1
      .transition()
      .duration(transitionDuration)
      .call(axis.x1);

    axis.y.tickSize(WIDTH - mg.l);

    dom.axis.y
      .call(axis.y)
      .call(drag);

    dom.axis.boundaries
      .attr('x1', (d, i) => scale.x.range()[i])
      .attr('x2', (d, i) => scale.x.range()[i])
      .attr('y1', 10)
      .attr('y2', 20);

    dom.axis.label1
      .attr('x', scale.x.range()[1] - 5);
  }

  /**
   * Render left and right time shifting controls
   */
  function renderTimeControls() {
    const zoomLabels = copy[app.language].timeline.zooms;
    zoomLevels.forEach((level, i) => {
      level.label = zoomLabels[i];
    });

    // These controls on timeline svg
    dom.backwards.select('circle')
      .attr('transform', `translate(${scale.x.range()[0] + 20}, 62)`)
      .attr('r', 15);

    dom.backwards.select('path')
      .attr('d', d3.symbol().type(d3.symbolTriangle).size(80))
      .attr('transform', `translate(${scale.x.range()[0] + 20}, 62)rotate(270)`);

    dom.forward.select('circle')
      .attr('transform', `translate(${scale.x.range()[1] - 20}, 62)`)
      .attr('r', 15);

    dom.forward.select('path')
      .attr('d', d3.symbol().type(d3.symbolTriangle).size(80))
      .attr('transform', `translate(${scale.x.range()[1] - 20}, 62)rotate(90)`);

    // These controls on separate svg
    dom.playGroup.select('circle')
      .attr('transform', 'translate(135, 60)rotate(90)')
      .attr('r', 25);

    dom.play.select('path')
      .attr('d', d3.symbol().type(d3.symbolTriangle).size(260))
      .attr('transform', 'translate(135, 60)rotate(90)');

    dom.pause.selectAll('rect')
      .attr('transform', (d, i) => `translate(${125 + (i * 15)}, 47)`)
      .attr('height', 25)
      .attr('width', 5);

    dom.zooms.selectAll('text')
      .text(d => d.label)
      .attr('x', 60)
      .attr('y', (d, i) => (i * 15) + 20)
      .classed('active', level => level.active);

    dom.forward
      .on('click', () => moveTime('forward'));

    dom.backwards
      .on('click', () => moveTime('backwards'));

    dom.playGroup
      .on('click', () => {
        return (isPlaying) ? stopBrushTransition() : playBrushTransition();
      });

    dom.zooms.selectAll('text')
      .on('click', zoom => applyZoom(zoom));
  }

  /**
   * Updates data displayed by this timeline, but only render if necessary
   * @param {Object} domain: Redux state domain subtree
   * @param {Object} app: Redux state app subtree
   */
  function updateAxis(domain) {
    const categories = domain.categories
    const groupStep = (106 - 30) / categories.length;
    let groupYs = Array.apply(null, Array(categories.length));
    groupYs = groupYs.map((g, i) => {
      return 30 + i * groupStep;
    });

    scale.y = d3.scaleOrdinal()
      .domain(categories)
      .range(groupYs);

    axis.y =
      d3.axisLeft(scale.y)
        .tickValues(categories);
  }

  function update(domain, app) {
    updateAxis(domain);
    renderAxis();

    events = domain.events;
    timerange = app.timerange;
    selected = app.selected.slice(0);
    updateTimeRange();
  }

  function render() {
    renderAxis();
    renderTimeControls();
    renderTimeLabels();

    renderEvents();
    renderHighlight();
  }

  return {
    update,
    render,
  };
}
