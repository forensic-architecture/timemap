import React from 'react';
import { connect } from 'react-redux';
import * as selectors from '../selectors';

import copy from '../js/data/copy.json';
import TimelineLogic from '../js/timeline/timeline.js';

class Timeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFolded: false
    };
  }

  componentDidMount() {
    const app = {
      zoomLevels: this.props.zoomLevels,
      timerange: this.props.timerange,
      selected: this.props.selected,
      language: this.props.language,
    }
    const ui = {
      tools: this.props.tools,
      dom: this.props.dom
    }

    const methods = {
      select: this.props.select,
      filter: this.props.filter,
      getCategoryColor: this.props.getCategoryColor
    }

    this.timeline = new TimelineLogic(app, ui, methods);
    this.timeline.update(this.props.domain, app);
    this.timeline.render(this.props.domain);
  }

  componentWillReceiveProps(nextProps) {
    const app = {
      timerange: nextProps.timerange,
      selected: nextProps.selected,
      language: nextProps.language,
      select: nextProps.select,
      filter: nextProps.filter,
      getCategoryColor: nextProps.getCategoryColor
    }

    this.timeline.update(this.props.domain, app);
    this.timeline.render(this.props.domain);
  }

  onClickArrow() {
    this.setState((prevState, props) => {
      return {isFolded: !prevState.isFolded};
    });
  }

  renderLabels() {
    const labels = copy[this.props.language].timeline.labels;
    return this.props.categories.map((label) => {
      const groupLen = this.props.categories.length
      return (<div className="timeline-label">{label}</div>);
    });
  }

  render() {
    let events = this.props.events
    const labels_title_lang = copy[this.props.language].timeline.labels_title;
    const info_lang = copy[this.props.language].timeline.info;
    let classes = `timeline-wrapper ${(this.state.isFolded) ? ' folded' : ''}`;
    const date0 = this.props.tools.formatterWithYear(this.props.timerange[0]);
    const date1 = this.props.tools.formatterWithYear(this.props.timerange[1]);

    return (
      <div className={classes}>
        <div className="timeline-header">
          <div className="timeline-toggle" onClick={() => this.onClickArrow()}>
            <p><i className="arrow-down"></i></p>
          </div>
          <div className="timeline-info">
            <p>{info_lang}</p>
            <p>{date0} - {date1}</p>
          </div>
        </div>
        <div className="timeline-content">
          <div id="timeline" className="timeline" />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    domain: {
      events: state.domain.events,
      categories: selectors.selectCategories(state),
      narratives: state.domain.narratives
    },
    language: state.app.language,
    tools: state.ui.tools,
    timerange: selectors.getTimeRange(state),
    zoomLevels: state.app.zoomLevels,
    dom: state.ui.dom,
    selected: state.app.selected
  }
}

export default connect(mapStateToProps)(Timeline);