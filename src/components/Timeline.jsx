import React from 'react';
import { connect } from 'react-redux';
import * as selectors from '../selectors';

import copy from '../js/data/copy.json';
import TimelineLogic from '../js/timeline/timeline.js';

class Timeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isFolded: false};
  }

  componentDidMount() {
      const domain = {
        events: this.props.events,
        narratives: this.props.narratives,
        categories: this.props.categories
      }
      const app = {
        timerange: this.props.timerange,
        selected: this.props.selected,
        language: this.props.language,
        select: this.props.select,
        filter: this.props.filter,
        getCategoryColor: this.props.getCategoryColor
      }
      const ui = {
        tools: this.props.tools,
        dom: this.props.dom
      }

      this.timeline = new TimelineLogic(app, ui);
      this.timeline.update(domain, app);
      this.timeline.render(domain);
  }

  componentWillReceiveProps(nextProps) {
    const domain = {
      events: nextProps.events,
      narratives: nextProps.narratives,
      categories: nextProps.categories
    }

    const app = {
      timerange: nextProps.timerange,
      selected: nextProps.selected,
      language: nextProps.language,
      select: nextProps.select,
      filter: nextProps.filter,
      getCategoryColor: nextProps.getCategoryColor
    }

    this.timeline.update(domain, app);
    this.timeline.render(domain);
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
    events: state.domain.events,
    categories: selectors.selectCategories(state),
    language: state.app.language,
    tools: state.ui.tools,
    timerange: selectors.getTimeRange(state),
    dom: state.ui.dom,
    selected: state.app.selected
  }
}

export default connect(mapStateToProps)(Timeline);