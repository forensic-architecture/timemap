import React from 'react';
import { connect } from 'react-redux';
import * as selectors from '../selectors';
import hash from 'object-hash';

import copy from '../js/data/copy.json';
import { formatterWithYear, parseDate } from '../js/utilities';
import TimelineHeader from './presentational/TimelineHeader';
import TimelineAxis from './TimelineAxis.jsx';
import TimelineClip from './presentational/TimelineClip';
import TimelineHandles from './TimelineHandles.jsx';
import TimelineZoomControls from './TimelineZoomControls.jsx';
import TimelineLabels from './TimelineLabels.jsx';
import TimelineMarkers from './TimelineMarkers.jsx'
import TimelineEvents from './TimelineEvents.jsx';
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
      softTimeUpdate: 0,
      scaleX: null,
      scaleY: null,
      timerange: [null, null],
      dragPos0: null
    };
  }

  componentDidMount() {
    this.computeDims();
    window.addEventListener('resize', () => { this.computeDims(); });
  }

  componentWillReceiveProps(nextProps) {
    if (hash(nextProps) !== hash(this.props)) {
      const categories = nextProps.domain.categories;
      const cats = categories.map((g, i) => (i + 1) * 80 / categories.length);

      this.setState({
        timerange: nextProps.app.timerange,
        scaleX: d3.scaleTime().domain(nextProps.app.timerange).range([this.state.dims.margin_left, this.state.dims.width]),
        scaleY: d3.scaleOrdinal().domain(nextProps.domain.categories).range(cats)
      });
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
      const WIDTH = boundingClient.width;
      this.setState({ dims: Object.assign({}, this.state.dims, { width: WIDTH }) });
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

    this.state.scaleX.domain([domain0, domainF]);
    this.props.methods.onUpdateTimerange(this.state.scaleX.domain());
  }

  /**
   * Shift time range by moving forward or backwards
   * WITHOUT updating the store
   * @param {String} direction: 'forward' / 'backwards'
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

    this.state.scaleX.domain([
      d3.timeMinute.offset(newCentralTime, -zoom.duration / 2),
      d3.timeMinute.offset(newCentralTime, zoom.duration / 2)
    ]);

    this.props.methods.onUpdateTimerange(this.state.scaleX.domain());
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

    const newDomain0 = d3.timeSecond.offset(this.state.timerange[0], timeShift);
    const newDomainF = d3.timeSecond.offset(this.state.timerange[1], timeShift);

    this.state.scaleX.domain([newDomain0, newDomainF]);

    // Updates components without updating timerange
    this.onSoftTimeRangeUpdate([newDomain0, newDomainF]);
  }

  onDragEnd() {
    this.toggleTransition(true);
    this.setState({
      timerange: this.state.scaleX.domain()
    }, () => {
      this.props.methods.onUpdateTimerange(this.state.scaleX.domain());  
    });
  }

  renderSVG() {
    const dims = this.state.dims;

    return (
      <svg
        ref={this.svgRef}
        width={dims.width}
        height={dims.height}
      >
        <TimelineClip dims={dims} />
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
