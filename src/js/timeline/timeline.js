/*
  TIMELINE
  Displays events over the course of the night
  Allows brushing and selecting periods of time in it
  TODO: is it possible to express this idiomatically as React?
*/
import { parseDate } from '../utilities';
import hash from 'object-hash';
import esLocale from '../data/es-MX.json';

export default function(svg, ui, methods) {
  d3.timeFormatDefaultLocale(esLocale);

  let categories = [];
  let timerange = [null, null];

  // Dimension of the client
  const WIDTH_CONTROLS = 100;
  let WIDTH = getCurrentWidth() - WIDTH_CONTROLS;
  const HEIGHT = 80;

  // NB: is it possible to do this with SCSS?
  // A: Maybe, although we are using it programmatically here for now
  const margin = { left: 120, top: 20 };

  // Drag behavior
  let dragPos0;
  let transitionDuration = 300;

  /**
   * Create scales
   */
  const scale = {};
  scale.x = d3.scaleTime()
      .domain(timerange)
      .range([margin.left, WIDTH]);

  scale.y = d3.scaleOrdinal()


  /**
   * Initilize SVG elements and groups
   */
  const dom = {};

  dom.svg = d3.select(svg)

  /*
   * Axis group elements
   */
  dom.axis = {};

  dom.axis.x0 = dom.svg.append('g')
    .attr('transform', `translate(0, 25)`)
    .attr('clip-path', 'url(#clip')
    .attr('class', 'axis xAxis');

  dom.axis.x1 = dom.svg.append('g')
    .attr('transform', `translate(0, 105)`)
    .attr('clip-path', 'url(#clip')
    .attr('class', 'axis axisHourText');

  /*
   * Initialize axis function and element group
   */
  const axis = {};

  axis.x0 =
    d3.axisBottom(scale.x)
    .ticks(10)
    .tickPadding(5)
    .tickSize(HEIGHT)
    .tickFormat(d3.timeFormat('%d %b'));

  axis.x1 =
    d3.axisBottom(scale.x)
    .ticks(10)
    .tickPadding(margin.top)
    .tickSize(0)
    .tickFormat(d3.timeFormat('%H:%M'));

  axis.y =
    d3.axisLeft(scale.y)
    .tickValues([]);

  updateAxis();

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

        scale.x.range([margin.left, WIDTH]);
        axis.y.tickSize(WIDTH - margin.left);
        dom.axis.y.attr('transform', `translate(${WIDTH}, 0)`)
        render(null);
      }
    });
  }
  addResizeListener();

  /**
   * Get y height of eventPoint, considering the ordinal Y scale
   * @param {object} eventPoint: regular eventPoint data
   */
  function getEventY(eventPoint) {
    const yGroup = eventPoint.category;
    return scale.y(yGroup);
  }

  /**
   * Get x position of eventPoint, considering the time scale
   * @param {object} eventPoint: regular eventPoint data
   */
  function getEventX(eventPoint) {
    return scale.x(parseDate(eventPoint.timestamp));
  }

  /**
   * Returns the time scale (x) extent in minutes
   */
  function getTimeScaleExtent() {
    return (scale.x.domain()[1].getTime() - scale.x.domain()[0].getTime()) / 60000;
  }

  /**
   * Apply zoom level to timeline
   * @param {object} zoom: zoom level from zoomLevels
   */
  function applyZoom(zoom) {
    const extent = getTimeScaleExtent();
    const newCentralTime = d3.timeMinute.offset(scale.x.domain()[0], extent / 2);

    scale.x.domain([
      d3.timeMinute.offset(newCentralTime, -zoom.duration / 2),
      d3.timeMinute.offset(newCentralTime, zoom.duration / 2)
    ]);

    methods.onUpdateTimerange(scale.x.domain());
  }


  /**
   * Shift time range by moving forward or backwards
   * @param {String} direction: 'forward' / 'backwards'
   */
  function moveTime(direction) {
    methods.onSelect();
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
    methods.onUpdateTimerange(scale.x.domain());
  }

  function toggleTransition(isTransition) {
    transitionDuration = (isTransition) ? 500 : 0;
  }


  /*
   * Setup drag behavior
   */
  function onDragStart(ev) {
    d3.event.sourceEvent.stopPropagation();
    dragPos0 = d3.event.x;
    toggleTransition(false);
  }

  /*
   * Drag and update
   */
  function onDrag() {
    const drag0 = scale.x.invert(dragPos0).getTime();
    const dragNow = scale.x.invert(d3.event.x).getTime();
    const timeShift = (drag0 - dragNow) / 1000;

    const newDomain0 = d3.timeSecond.offset(timerange[0], timeShift);
    const newDomainF = d3.timeSecond.offset(timerange[1], timeShift);

    scale.x.domain([newDomain0, newDomainF]);
    render();
    // Updates components without updating timerange
    methods.onSoftUpdate(1);
  }

  function onDragEnd() {
    toggleTransition(true);
    timerange = scale.x.domain();
    methods.onSoftUpdate(0);
    methods.onUpdateTimerange(scale.x.domain());
  }

  const drag = d3.drag()
    .on('start', onDragStart)
    .on('drag', onDrag)
    .on('end', onDragEnd);

  /**
   * Updates data displayed by this timeline, but only render if necessary
   * @param {Object} domain: Redux state domain subtree
   * @param {Object} app: Redux state app subtree
   */
  function updateAxis() {
    let groupYs = Array.apply(null, Array(categories.length));
    groupYs = groupYs.map((g, i) => {
      return (i + 1) * HEIGHT / groupYs.length;
    });
    scale.y = d3.scaleOrdinal()
      .domain(categories)
      .range(groupYs);

    axis.y =
      d3.axisLeft(scale.y)
        .tickValues(categories.map(c => c.category));
  }


  /**
   * Render axis on timeline and viewbox boundaries
   */
  function renderAxis() {
    dom.axis.x0
      .transition()
      .duration(transitionDuration)
      .call(axis.x0);

    dom.axis.x1
      .transition()
      .duration(transitionDuration)
      .call(axis.x1);

    axis.y.tickSize(WIDTH - margin.left);

    if (!dom.axis.dragGrabber) {
      dom.axis.dragGrabber = dom.svg.insert('rect', ':first-child')
      .attr('class', 'drag-grabber')
      .attr('x', margin.left)
      .attr('y', margin.top)
      .attr('width', WIDTH - margin.left)
      .attr('height', HEIGHT)
      .call(drag);
    }   
    
    if (!dom.axis.y) {
      dom.axis.y = dom.svg.insert('g', ':first-child')
      .attr('transform', `translate(${WIDTH}, 0)`)
      .attr('class', 'yAxis');
    }

    dom.axis.y
      .call(axis.y);
  }


  /**
   * Updates displayable data on the timeline: events, selected and
   * potentially adjusts time range
   * @param {Object} newCategories: object of arrays of categories
   * @param {Object} newTimerange: object of time range
   */
  function update(newCategories, newTimerange) {
    if (hash(categories) !== hash(newCategories)) categories = newCategories;
    if (hash(timerange) !== hash(newTimerange)) timerange = newTimerange;
    scale.x.domain(timerange);
    render();
  }

  function render() {
    updateAxis();
    renderAxis();
  }

  return {
    getEventX,
    getEventY,
    applyZoom,
    moveTime,
    update
  };
}
