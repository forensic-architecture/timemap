import React from 'react';
import { connect } from 'react-redux';
import * as selectors from '../selectors';
import hash from 'object-hash';

import copy from '../js/data/copy.json';
import { formatterWithYear, isNotNullNorUndefined } from '../js/utilities';
import TimelineHeader from './presentational/TimelineHeader';
import TimelineLogic from '../js/timeline/timeline.js';

class Timeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFolded: false
    };
  }

  componentDidMount() {
    this.timeline = new TimelineLogic(this.props.app, this.props.ui, this.props.methods);
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
          <div id={ui.dom.timeline} className="timeline" />
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
