import React from 'react';
import { connect } from 'react-redux';
import * as selectors from '../selectors';
import hash from 'object-hash';

import copy from '../js/data/copy.json';
import { formatterWithYear } from '../js/utilities';
import TimelineHeader from './presentational/TimelineHeader';
import TimelineClip from './presentational/TimelineClip';
import TimelineHandles from './TimelineHandles.jsx';
import TimelineZoomControls from './TimelineZoomControls.jsx';
import TimelineLogic from '../js/timeline/timeline.js';
import TimelineLabels from './TimelineLabels.jsx';
import TimelineMarkers from './TimelineMarkers.jsx'
import TimelineEvents from './TimelineEvents.jsx';

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
        margin_left: 120        
      },
      softTimeUpdate: 0
    };
  }

  componentDidMount() {
    this.methods = Object.assign({}, this.props.methods, { onSoftUpdate: (toggle) => { this.setState({ softTimeUpdate: toggle }) }});
    this.timeline = new TimelineLogic(this.svgRef.current, this.props.ui, this.methods);
    this.timeline.update(this.props.domain.categories, this.props.app.timerange);
    this.computeDims();
    window.addEventListener('resize', () => { this.computeDims(); });
  }

  componentWillReceiveProps(nextProps) {
    if (hash(nextProps) !== hash(this.props)) {
      this.timeline.update(nextProps.domain.categories, nextProps.app.timerange);
    }
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

  onMoveTime(dir) {
    if (this.timeline) {
      return this.timeline.moveTime(dir);
    }
    return null;
  }

  onApplyZoom(zoom) {
    if (this.timeline) {
      return this.timeline.applyZoom(zoom);
    }
    return null;
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
          timelabels={this.props.app.timerange}
        />
        <TimelineMarkers
          selected={this.props.app.selected}
          getEventX={(e) => this.timeline.getEventX(e)}
          getEventY={(e) => this.timeline.getEventY(e)}
        />
        <TimelineEvents
          events={this.props.domain.events}
          getEventX={(e) => this.timeline.getEventX(e)}
          getEventY={(e) => this.timeline.getEventY(e)}
          getCategoryColor={this.props.methods.getCategoryColor}
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
