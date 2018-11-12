import '../scss/main.scss';
import copy from '../js/data/copy.json';
import React from 'react';
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
        categoryGroups: this.props.categoryGroups
      }
      const app = {
        range: this.props.range,
        selected: this.props.selected,
        language: this.props.language,
        select: this.props.select,
        filter: this.props.filter,
        getCategoryLabel: this.props.getCategoryLabel,
        getCategoryGroup: this.props.getCategoryGroup,
        getCategoryGroupColor: this.props.getCategoryGroupColor
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
      categoryGroups: nextProps.categoryGroups
    }

    const app = {
      range: nextProps.range,
      selected: nextProps.selected,
      language: nextProps.language,
      select: nextProps.select,
      filter: nextProps.filter,
      getCategoryLabel: nextProps.getCategoryLabel,
      getCategoryGroup: nextProps.getCategoryGroup,
      getCategoryGroupColor: nextProps.getCategoryGroupColor
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
    return this.props.categoryGroups.map((label) => {
      const groupLen = this.props.categoryGroups.length
      return (<div className="timeline-label">{label}</div>);
    });
  }

  render() {
    const labels_title_lang = copy[this.props.language].timeline.labels_title;
    const info_lang = copy[this.props.language].timeline.info;
    let classes = `timeline-wrapper ${(this.state.isFolded) ? ' folded' : ''}`;
    const date0 = this.props.tools.formatterWithYear(this.props.range[0]);
    const date1 = this.props.tools.formatterWithYear(this.props.range[1]);
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

export default Timeline;
