import copy from '../js/data/copy.json';
import {
  isNotNullNorUndefined,
  parseDate,
  formatterWithYear
} from '../js/utilities';
import React from 'react';

import Spinner from './presentational/Spinner';
import CardTimestamp from './presentational/CardTimestamp';
import CardLocation from './presentational/CardLocation';
import CardCaret from './presentational/CardCaret';
import CardTags from './presentational/CardTags';
import CardSummary from './presentational/CardSummary';
import CardSource from './presentational/CardSource';
import CardCategory from './presentational/CardCategory';
import CardNarrative from './presentational/CardNarrative';

class Card extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isHighlighted: false
    };
  }

  toggle() {
    this.setState({
      isHighlighted: !this.state.isHighlighted
    }, () => {
      if (!this.state.isHighlighted) {
        this.props.highlight(this.props.event);
      } else {
        this.props.highlight(null);
      }
    });
  }

  makeTimelabel(timestamp) {
    if (timestamp === null) return null;
    const parsedTimestamp = parseDate(timestamp);
    const timelabel = formatterWithYear(parsedTimestamp);
    return timelabel;
  }

  renderCategory() {
    const categoryTitle = copy[this.props.language].cardstack.category;
    const categoryLabel = this.props.event.category;
    const color = this.props.getCategoryColor(this.props.event.category);

    return (
      <CardCategory
        categoryTitle={categoryTitle}
        categoryLabel={categoryLabel}
        color={color}
      />
    );
  }

  renderSummary() {
    return (
      <CardSummary
        language={this.props.language}
        description={this.props.event.description}
        isHighlighted={this.state.isHighlighted}
      />
    )
  }

  renderTags() {
    if (!this.props.tags || (this.props.tags && this.props.tags.length === 0)) {
      return null
    }
    return (
      <CardTags
        tags={this.props.tags || []}
        language={this.props.language}
      />
    )
  }

  renderLocation() {
    return (
      <CardLocation
        language={this.props.language}
        location={this.props.event.location}
      />
    )
  }

  renderSources() {
    if (this.props.sourceError) {
      return <div>ERROR: something went wrong loading sources, TODO:</div>
    }

    const source_lang = copy[this.props.language].cardstack.sources
    return (
      <div className="card-col">
        <h4>{source_lang}: </h4>
        {this.props.event.sources.map(source => (
          <CardSource
            isLoading={this.props.isLoading}
            language={this.props.language}
            source={source}
          />
        ))}
      </div>
    )
  }

  // NB: should be internaionalized.
  renderTimestamp() {
    return (
      <CardTimestamp
        makeTimelabel={(timestamp) => this.makeTimelabel(timestamp)}
        language={this.props.language}
        timestamp={this.props.event.timestamp}
      />
    );
  }

  renderNarrative() {
    const links = this.props.getNarrativeLinks(this.props.event);

    if (links !== null) {

      return (
        <CardNarrative
          select={(event) => this.props.select([event])}
          makeTimelabel={(timestamp) => this.makeTimelabel(timestamp)}
          next={links.next}
          prev={links.prev}
        />
      )
    }
  }

  renderHeader() {
    return (
      <div className="card-collapsed">
        <div className="card-row">
          {this.renderTimestamp()}
          {this.renderLocation()}
        </div>
        {this.renderCategory()}
        <br/>
        {this.renderSummary()}
      </div>
    );
  }

  renderContent() {
    if (this.state.isHighlighted) {
      return (
        <div className="card-bottomhalf">
          {this.renderTags()}
          {this.renderSources()}
          {this.renderNarrative()}
        </div>
      )
    } else {
      return <div classname="card-bottomhalf"></div>
    }
  }

  renderCaret() {
    return (
      <CardCaret
        toggle={() => this.toggle()}
        isHighlighted={this.state.isHighlighted}
      />
    )
  }

  render() {
    return (
      <li className='event-card'>
        {this.renderHeader()}
        {this.renderContent()}
        {this.renderCaret()}
      </li>
    );
  }
}

export default Card;
