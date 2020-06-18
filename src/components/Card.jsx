import copy from '../common/data/copy.json'
import React from 'react'

import CardTime from './presentational/Card/Time'
import CardLocation from './presentational/Card/Location'
import CardCaret from './presentational/Card/Caret'
import CardFilters from './presentational/Card/Filters'
import CardSummary from './presentational/Card/Summary'
import CardSource from './presentational/Card/Source'
import CardNarrative from './presentational/Card/Narrative'

class Card extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: false
    }
  }

  toggle () {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  makeTimelabel (datetime) {
    if (datetime === null) return null
    return datetime.toLocaleDateString()
  }

  renderSummary () {
    return (
      <CardSummary
        language={this.props.language}
        description={this.props.event.description}
        isOpen={this.state.isOpen}
      />
    )
  }

  renderFilters () {
    if (!this.props.filters || (this.props.filters && this.props.filters.length === 0)) {
      return null
    }
    return (
      <CardFilters
        filters={this.props.filters || []}
        language={this.props.language}
      />
    )
  }

  renderLocation () {
    return (
      <CardLocation
        language={this.props.language}
        location={this.props.event.location}
        isPrecise={(!this.props.event.type || this.props.event.type === 'Structure')}
      />
    )
  }

  renderSources () {
    if (this.props.sourceError) {
      return <div>ERROR: something went wrong loading sources, TODO:</div>
    }

    const sourceLang = copy[this.props.language].cardstack.sources
    return (
      <div className='card-col'>
        <h4>{sourceLang}: </h4>
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
  renderTime () {
    let timelabel = this.makeTimelabel(this.props.event.datetime)

    let precision = this.props.event.time_display
    if (precision === '_date_only') {
      precision = ''
      timelabel = timelabel.substring(0, 11)
    } else if (precision === '_approximate_date_only') {
      precision = ' (Approximate date)'
      timelabel = timelabel.substring(0, 11)
    } else if (precision === '_approximate_datetime') {
      precision = ' (Approximate datetime)'
    } else {
      timelabel = timelabel.substring(0, 11)
    }

    return (
      <CardTime
        makeTimelabel={timelabel}
        language={this.props.language}
        timelabel={timelabel}
        precision={precision}
      />
    )
  }

  renderNarrative () {
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

  renderMain () {
    return (
      <div className='card-container'>
        <div className='card-row details'>
          {this.renderTime()}
          {this.renderLocation()}
        </div>
        {this.renderSummary()}
      </div>
    )
  }

  renderExtra () {
    return (
      <div className='card-bottomhalf'>
        {this.renderFilters()}
        {this.renderSources()}
        {this.renderNarrative()}
      </div>
    )
  }

  renderCaret () {
    return this.props.features.USE_SOURCES ? (
      <CardCaret
        toggle={() => this.toggle()}
        isOpen={this.state.isOpen}
      />
    ) : null
  }

  render () {
    const { isSelected, idx } = this.props

    return (
      <li
        className={`event-card ${isSelected ? 'selected' : ''}`}
        id={`event-card-${idx}`}
        ref={this.props.innerRef}
      >
        {this.renderMain()}
        {this.state.isOpen ? this.renderExtra() : null}
        {isSelected ? this.renderCaret() : null}
      </li>
    )
  }
}

// The ref to each card will be used in CardStack for programmatic scrolling
export default React.forwardRef((props, ref) => <Card innerRef={ref} {...props} />)
