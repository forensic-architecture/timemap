import React from 'react';
import { connect } from 'react-redux';
import * as selectors from '../selectors';
import hash from 'object-hash';

import copy from '../js/data/copy.json';
import { formatterWithYear, isNotNullNorUndefined } from '../js/utilities';
import TimelineHeader from './presentational/TimelineHeader';
import TimelineHandles from './TimelineHandles.jsx';
import TimelineZoomControls from './TimelineZoomControls.jsx';
import TimelineLogic from '../js/timeline/timeline.js';


class Timeline extends React.Component {
  constructor(props) {
    super(props);
    this.svgRef = React.createRef()
    this.state = {
      isFolded: false
    };
  }

  componentDidMount() {
    this.timeline = new TimelineLogic(this.svgRef.current, this.props.app, this.props.ui, this.props.methods);
    this.timeline.update(this.props.domain, this.props.app);
  }

  componentWillReceiveProps(nextProps) {
    if (hash(nextProps) !== hash(this.props)) {
      this.timeline.update(nextProps.domain, nextProps.app);
    }
  }

  onClickArrow() {
    this.setState((prevState, props) => {
      return {isFolded: !prevState.isFolded};
    });
  }

  getClientDims() {
    const WIDTH_CONTROLS = 100;
    const HEIGHT = 140;
    let WIDTH = 0;

    if (document.querySelector(`#${this.props.ui.dom.timeline}`) !== null) {
      const boundingClient = document.querySelector(`#${this.props.ui.dom.timeline}`).getBoundingClientRect();
      WIDTH = boundingClient.width;
    }
    return {
      height: HEIGHT,
      width: WIDTH,
      width_controls: WIDTH_CONTROLS,
      height_controls: 115,
      margin_left: 120
    }
  }

  onMoveTime(dir) {
    if (this.timeline) {
      return this.timeline.moveTime(dir);
    }
    return '';
  }

  onApplyZoom(zoom) {
    if (this.timeline) {
      return this.timeline.applyZoom(zoom);
    }
    return '';
  }  

  renderSVG() {
    const dims = this.getClientDims();
  
    return (
      <svg
        ref={this.svgRef}
        width={dims.width}
        height={dims.height}
      >
        <clipPath id="clip">
          <rect x="120" y="0" width={dims.width - dims.margin_left - dims.width_controls} height={dims.height - 25}></rect>
        </clipPath>
        <TimelineHandles dims={dims} onMoveTime={(dir) => { this.onMoveTime(dir) }} />
        <TimelineZoomControls zoomLevels={this.props.app.zoomLevels} dims={dims} onApplyZoom={(zoom) => { this.onApplyZoom(zoom); }} />
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
          title={copy[app.language].timeline.info}
          date0={formatterWithYear(app.timerange[0])}
          date1={formatterWithYear(app.timerange[1])}
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
