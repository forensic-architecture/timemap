import copy from '../js/data/copy.json'
import {
  isNotNullNorUndefined,
  parseDate,
  formatterWithYear
} from '../js/utilities'
import React from 'react'

import Spinner from './presentational/Spinner'
import CardTimestamp from './presentational/Card/Timestamp'
import CardLocation from './presentational/Card/Location'
import CardCaret from './presentational/Card/Caret'
import CardTags from './presentational/Card/Tags'
import CardSummary from './presentational/Card/Summary'
import CardSource from './presentational/Card/Source'
import CardCategory from './presentational/Card/Category'
import CardNarrative from './presentational/Card/Narrative'

class Card extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isOpen: false
    }
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  makeTimelabel(timestamp) {
    if (timestamp === null) return null
    const parsedTimestamp = parseDate(timestamp)
    const timelabel = formatterWithYear(parsedTimestamp)
    return timelabel
  }

  renderCategory() {
    const categoryTitle = copy[this.props.language].cardstack.category
    const categoryLabel = this.props.event.category
    const color = this.props.getCategoryColor(this.props.event.category)

    return null
    // return (
    //   <CardCategory
    //     categoryTitle={categoryTitle}
    //     categoryLabel={categoryLabel}
    //     color={color}
    //   />
    // )
  }

  renderSummary() {
    return (
      <CardSummary
        language={this.props.language}
        description={this.props.event.description}
        isOpen={this.state.isOpen}
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
      <div className='card-col'>
        <h4>{source_lang}: </h4>
        {this.props.event.sources.map(source => (
          <CardSource
            isLoading={this.props.isLoading}
            source={source}
            onClickHandler={source => this.props.onViewSource(source)}
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
    )
  }

  renderNarrative() {
    const links = this.props.getNarrativeLinks(this.props.event)

    if (links !== null) {

      return (
        <CardNarrative
          select={(event) => this.props.onSelect([event])}
          makeTimelabel={(timestamp) => this.makeTimelabel(timestamp)}
          next={links.next}
          prev={links.prev}
        />
      )
    }
  }

  renderMain() {
    return (
      <div className='card-container'>
        <div className='card-row details'>
          {this.renderTimestamp()}
          {this.renderLocation()}
        </div>
        {this.renderCategory()}
        {this.renderSummary()}
      </div>
    )
  }

  renderExtra() {
    return (
      <div className='card-bottomhalf'>
        {this.renderTags()}
        {this.renderSources()}
        {this.renderNarrative()}
      </div>
    )
  }

  renderCaret() {
    return (
      <CardCaret
        toggle={() => this.toggle()}
        isOpen={this.state.isOpen}
      />
    )
  }

  render() {
    const { isSelected } = this.props
    return (
     <li className={`event-card ${isSelected ? 'selected' : ''}`}>
        {this.renderMain()}
        {this.state.isOpen ? this.renderExtra() : null}
        {isSelected ? this.renderCaret() : null}
      </li>
    )
  }
}

export default Card
