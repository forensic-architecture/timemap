import '../scss/main.scss';
import copy from '../js/data/copy.json';
import {isNotNullNorUndefined} from '../js/data/utilities';
import React from 'react';

class Card extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isFolded: true
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    if (this.state.isFolded) {
      this.props.highlight(this.props.event);
    } else {
      this.props.highlight();
    }
    this.setState({
      isFolded: !this.state.isFolded
    });
  }

  getCategoryColorClass(category) {
    if (category)
      return this.props.getCategoryGroup(category);
    return 'other';
  }

  renderWarning() {
    const warning_lang = copy[this.props.language].cardstack.warning;

    if (this.props.event.tags) {
      const tagsArray = this.props.event.tags.split(",");
      /* TODO: This needs to be generalized */
      if (tagsArray.some(tag => {
        return (tag.name === 'contradicción' ||
         tag.name === 'declaración con sospecha de tortura')
      })) {
        return (<div className="warning event-card-section">{warning_lang}</div>);
      }
    }
  }

  renderCategory() {
    const category_lang = copy[this.props.language].cardstack.category;

    const colorType = this.getCategoryColorClass(this.props.event.category);
    const categoryLabel = this.props.getCategoryLabel(this.props.event.category);

    return (<div className="event-card-section category">
      <h4>{category_lang}</h4>
      <p><span className={`color-category ${colorType}`}/>{categoryLabel}</p>
    </div>);
  }

  // NB: is this function for a future feature?
  renderIncidents() {
    const incident_type_lang = copy[this.props.language].cardstack.incident_type;
    const incidentTags = []; //this.props.event.tags.filter(tag => tag.type === 'incident_type');

    return (<div className="event-card-section event-type">
      <h4>{incident_type_lang}</h4>
      {
        incidentTags.map((tag, idx) => {
          return (<span className={(
              tag.name === 'contradicción' || tag.name === 'declaración con sospecha de tortura')
              ? ' flagged'
              : ''}>
            {tag.name}{
              (idx < incidentTags.length - 1)
                ? ','
                : ''
            }
          </span>);
        })
      }
    </div>);
  }

  renderSummary() {
    const summary = copy[this.props.language].cardstack.description;
    const desc = this.props.event.description;
    const description = (this.state.isFolded) ? `${desc.substring(0, 40)}...` : desc;
    return (<div className="event-card-section summary">
      <h4>{summary}</h4>
      <p>{description}</p>
    </div>);
  }

  renderTags() {
    const people_lang = copy[this.props.language].cardstack.people;
    const peopleTags = []; //this.props.event.tags.filter(tag => tag.type === 'people');

    return (<div className="event-card-section tags">
      <h4>{people_lang}</h4>
      <p>{
          peopleTags.map((tag, idx) => {
            return (<span className="tag">
              {tag.name}
              {
                (idx < peopleTags.length - 1)
                  ? ','
                  : ''
              }
            </span>);
          })
        }</p>
    </div>);
  }

  // NB: is this function for a future feature? Should also be internaionalized.
  renderLocation() {
    const location_lang = copy[this.props.language].cardstack.location;
    if (isNotNullNorUndefined(this.props.event.location)) {
      return (<p className="event-card-section location">
        <h4>{location_lang}</h4>
        <p>{this.props.event.location}</p>
      </p>);
    } else {
      return (<p className="event-card-section location">
        <h4>{location_lang}</h4>
        <p>Sin localización conocida.</p>
      </p>);
    }
  }

  renderSource() {
    const source_lang = copy[this.props.language].cardstack.source;
    return (<div className="event-card-section source">
      <h4>{source_lang}</h4>
      <p>{this.props.event.source}</p>
    </div>);
  }

  getTimeLabel(){
    const timestamp = this.props.tools.parser(this.props.event.timestamp);
    const timelabel = this.props.tools.formatterWithYear(timestamp);
    return timelabel;
  }

  // NB: should be internaionalized.
  renderTimestamp() {
    const daytime_lang = copy[this.props.language].cardstack.timestamp;
    const estimated_lang = copy[this.props.language].cardstack.estimated;

    if (isNotNullNorUndefined(this.props.event.timestamp)) {
      const timelabel = this.getTimeLabel();
      return (<div className="event-card-section timestamp">
        <h4>{daytime_lang}</h4>
        {timelabel}
      </div>);
    } else {
      return (<div className="event-card-section timestamp">
        <h4>{daytime_lang}</h4>
        Hora no conocida
      </div>);
    }
  }

  renderHeader() {
    return (<div className="card-collapsed">
      {this.renderWarning()}
      {this.renderCategory()}
      {this.renderTimestamp()}
      {this.renderSummary()}
    </div>);
  }

  renderCardLink(event, direction) {
    if (event !== null) {
      const timelabel = this.getTimeLabel();
      return (<a onClick={() => this.props.select([event])}>
        {`${timelabel} - ${event.location}`}
      </a>);
    }
    return (<a className="disabled">None</a>);
  }

  renderNarrative() {
    const links = this.props.getNarrativeLinks(this.props.event);
    if (links !== null) {
      return (<div className="event-card-section">
        <h4>Connected events</h4>
        <p>Next: {this.renderCardLink(links.next, 'next')}</p>
        <p>Previous: {this.renderCardLink(links.prev, 'prev')}</p>
      </div>);
    }
  }

  renderContent() {
    if (this.state.isFolded) {
      return (<div className="card-bottomhalf folded"></div>);
    } else if (this.props.isFetchingEvents) {
      return (<div className="card-bottomhalf">
        {this.renderSpinner()}
      </div>);
    } else {
      if (!this.props.event.hasOwnProperty('receiver') && !this.props.event.hasOwnProperty('transmitter')) {
        return (<div className="card-bottomhalf">
          {this.renderLocation()}
          {this.renderTags()}
          {this.renderSource()}
          {this.renderNarrative()}
        </div>);
      } else {
        return (<div className="card-bottomhalf">
          {this.renderTags()}
          {this.renderSource()}
          {this.renderNarrative()}
        </div>);
      }
    }
  }


  renderSpinner() {
    return (<div className="spinner">
      <div className="double-bounce1"></div>
      <div className="double-bounce2"></div>
    </div>);
  }

  renderArrow() {
    let classes = (this.state.isFolded)
      ? 'arrow-down folded'
      : 'arrow-down';
    return (<div className="card-toggle" onClick={() => this.toggle()}>
      <p>
        <i className={classes}></i>
      </p>
    </div>);
  }

  render() {
    if (this.props.isLoading) {
      return (<li className='event-card'>
        <div className="card-bottomhalf">
          {this.renderSpinner()}
        </div>
      </li>);
    } else {
      return (<li className='event-card'>
        {this.renderHeader()}
        {this.renderContent()}
        {this.renderArrow()}
      </li>);
    }
  }
}

export default Card;
