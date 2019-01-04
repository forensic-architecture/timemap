/*
  TIMELINE
  Displays events over the course of the night
  Allows brushing and selecting periods of time in it
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
        dom.axis.y.attr('transform', `translate(${WIDTH}, 0)`)
        render(null);
      }
    });
  }
  addResizeListener();


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

  return {
    getEventX,
    update,
    onDragStart,
    onDrag,
    onDragEnd
  };
}
