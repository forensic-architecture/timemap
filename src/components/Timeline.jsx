import React from 'react';
import { connect } from 'react-redux';
import * as selectors from '../selectors';
import hash from 'object-hash';

import copy from '../js/data/copy.json';
import { formatterWithYear, parseDate } from '../js/utilities';
import TimelineHeader from './presentational/TimelineHeader';
import TimelineAxis from './TimelineAxis.jsx';
import TimelineClip from './presentational/TimelineClip';
import TimelineHandles from './presentational/TimelineHandles.js';
import TimelineZoomControls from './presentational/TimelineZoomControls.js';
import TimelineLabels from './presentational/TimelineLabels.js';
import TimelineMarkers from './presentational/TimelineMarkers.js'
import TimelineEvents from './presentational/TimelineEvents.js';
import TimelineCategories from './TimelineCategories.jsx';

class Timeline extends React.Component {
  constructor(props) {
    super(props);
    this.svgRef = React.createRef()
    this.state = {
      isFolded: false,
      dims: {
        height: 140,
        width: 0,
        width_controls: 100,
        height_controls: 115,
        margin_left: 120,
        margin_top: 20,
        trackHeight: 80      
      },
      scaleX: null,
      scaleY: null,
      timerange: [null, null],
      dragPos0: null,
      transitionDuration: 300
    };
  }

  componentDidMount() {
    this.computeDims();
    this.addEventListeners();
  }

  componentWillReceiveProps(nextProps) {
    if (hash(nextProps) !== hash(this.props)) {
      this.setState({
        timerange: nextProps.app.timerange,
        scaleX: this.makeScaleX()
      });
    }

    if (hash(nextProps.domain.categories) !== hash(this.props.domain.categories)) {
      this.setState({
        scaleY: this.makeScaleY(nextProps.domain.categories)
      });
    }
  }

  addEventListeners() {
    window.addEventListener('resize', () => { this.computeDims(); });
  }

  makeScaleX() {
    return d3.scaleTime()
    .domain(this.state.timerange)
    .range([this.state.dims.margin_left, this.state.dims.width - this.state.dims.width_controls]);
  }

  makeScaleY(categories) {
    const catsYpos = categories.map((g, i) => (i + 1) * this.state.dims.trackHeight / categories.length);
    return d3.scaleOrdinal()
      .domain(categories)
      .range(catsYpos);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.timerange !== this.state.timerange) {
      this.setState({ scaleX: this.makeScaleX() });
    }
  }

  /**
   * Get x position of eventPoint, considering the time scale
   * @param {object} eventPoint: regular eventPoint data
   */
  getEventX(eventPoint) {
    return this.state.scaleX(parseDate(eventPoint.timestamp));
  }

    /**
   * Get y height of eventPoint, considering the ordinal Y scale
   * @param {object} eventPoint: regular eventPoint data
   */
  getEventY(eventPoint) {
    return this.state.scaleY(eventPoint.category);
  }

  /**
   * Returns the time scale (x) extent in minutes
   */
  getTimeScaleExtent() {
    const timeDomain = this.state.scaleX.domain();
    return (timeDomain[1].getTime() - timeDomain[0].getTime()) / 60000;
  }

  onClickArrow() {
    this.setState((prevState, props) => {
      return {isFolded: !prevState.isFolded};
    });
  }

  computeDims() {
    const dom = this.props.ui.dom.timeline;
    if (document.querySelector(`#${dom}`) !== null) {
      const boundingClient = document.querySelector(`#${dom}`).getBoundingClientRect();

      this.setState({
        dims: Object.assign({}, this.state.dims, { width: boundingClient.width })
      });
    }
  }

    /**
   * Shift time range by moving forward or backwards
   * @param {String} direction: 'forward' / 'backwards'
   */
  onMoveTime(direction) {
    this.props.methods.onSelect();
    const extent = this.getTimeScaleExtent();
    const newCentralTime = d3.timeMinute.offset(this.state.scaleX.domain()[0], extent / 2);

    // if forward
    let domain0 = newCentralTime;
    let domainF = d3.timeMinute.offset(newCentralTime, extent);

    // if backwards
    if (direction === 'backwards') {
      domain0 = d3.timeMinute.offset(newCentralTime, -extent);
      domainF = newCentralTime;
    }

    this.setState({ timerange: [domain0, domainF] }, () => {
      this.props.methods.onUpdateTimerange(this.state.timerange);
    });
  }

  /**
   * Change display of time range
   * WITHOUT updating the store, or data shown.
   * Used for updates in the middle of a transition, for performance purposes
   */
  onSoftTimeRangeUpdate(timerange) {
    this.setState({ timerange });
  }

  /**
   * Apply zoom level to timeline
   * @param {object} zoom: zoom level from zoomLevels
   */
  onApplyZoom(zoom) {
    const extent = this.getTimeScaleExtent();
    const newCentralTime = d3.timeMinute.offset(this.state.scaleX.domain()[0], extent / 2);

    this.setState({ timerange: [
      d3.timeMinute.offset(newCentralTime, -zoom.duration / 2),
      d3.timeMinute.offset(newCentralTime, zoom.duration / 2)
    ]}, () => {
      this.props.methods.onUpdateTimerange(this.state.timerange);
    });
  }

  toggleTransition(isTransition) {
    this.setState({ transitionDuration: (isTransition) ? 300 : 0 });
  }

  /*
   * Setup drag behavior
   */
  onDragStart() {
    d3.event.sourceEvent.stopPropagation();
    this.setState({
      dragPos0: d3.event.x
    }, () => {
      this.toggleTransition(false);
    });
  }

  /*
   * Drag and update
   */
  onDrag() {
    const drag0 = this.state.scaleX.invert(this.state.dragPos0).getTime();
    const dragNow = this.state.scaleX.invert(d3.event.x).getTime();
    const timeShift = (drag0 - dragNow) / 1000;

    const newDomain0 = d3.timeSecond.offset(this.props.app.timerange[0], timeShift);
    const newDomainF = d3.timeSecond.offset(this.props.app.timerange[1], timeShift);

    // Updates components without updating timerange
    this.onSoftTimeRangeUpdate([newDomain0, newDomainF]);
  }

  /**
   * Stop dragging and update data
   */
  onDragEnd() {
    this.toggleTransition(true);
    this.props.methods.onUpdateTimerange(this.state.timerange);
  }

  renderSVG() {
    const dims = this.state.dims;

    return (
      <svg
        ref={this.svgRef}
        width={dims.width}
        height={dims.height}
      >
        <TimelineClip
          dims={dims}
        />
        <TimelineAxis
          dims={dims}
          timerange={this.props.app.timerange}
          transitionDuration={this.state.transitionDuration}
          scaleX={this.state.scaleX}
        />
        <TimelineCategories 
          dims={dims}
          onDragStart={() => { this.onDragStart() }}
          onDrag={() => { this.onDrag() }}
          onDragEnd={() => { this.onDragEnd() }}
          categories={this.props.domain.categories}
        />
        <TimelineHandles
          dims={dims}
          onMoveTime={(dir) => { this.onMoveTime(dir) }}
        />
        <TimelineZoomControls
          zoomLevels={this.props.app.zoomLevels}
          dims={dims}
          onApplyZoom={(zoom) => { this.onApplyZoom(zoom); }}
        />
        <TimelineLabels
          dims={dims}
          timelabels={this.state.timerange}
        />
        <TimelineMarkers
          selected={this.props.app.selected}
          getEventX={(e) => this.getEventX(e)}
          getEventY={(e) => this.getEventY(e)}
          transitionDuration={this.state.transitionDuration}
        />
        <TimelineEvents
          events={this.props.domain.events}
          getEventX={(e) => this.getEventX(e)}
          getEventY={(e) => this.getEventY(e)}
          getCategoryColor={this.props.methods.getCategoryColor}
          transitionDuration={this.state.transitionDuration}
          onSelect={this.props.methods.onSelect}
        />
      </svg>
    ); 
  }

  render() {
    const { isNarrative, app, ui } = this.props
    let classes = `timeline-wrapper ${(this.state.isFolded) ? ' folded' : ''}`;
    classes += (app.narrative !== null) ? ' narrative-mode' : '';
    return (
      <div className={classes}>
        <TimelineHeader
          title={copy[this.props.app.language].timeline.info}
          date0={formatterWithYear(this.state.timerange[0])}
          date1={formatterWithYear(this.state.timerange[1])}
          onClick={() => { this.onClickArrow(); }}
          hideInfo={isNarrative}
        />
        <div className="timeline-content">
          <div id={this.props.ui.dom.timeline} className="timeline">
            {this.renderSVG()}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isNarrative: !!state.app.narrative,
    domain: {
      events: state.domain.events,
      categories: selectors.selectCategories(state),
      narratives: state.domain.narratives
    },
    app: {
      timerange: selectors.getTimeRange(state),
      selected: state.app.selected,
      language: state.app.language,
      zoomLevels: state.app.zoomLevels,
      narrative: state.app.narrative
    },
    ui: {
      dom: state.ui.dom,
    }
  }
}

export default connect(mapStateToProps)(Timeline);
