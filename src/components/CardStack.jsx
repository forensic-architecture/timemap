import React from 'react'
import { connect } from 'react-redux'
import * as selectors from '../selectors'

import Card from './Card.jsx'
import copy from '../js/data/copy.json'

class CardStack extends React.Component {
  renderCards (events, selections) {
    // if no selections provided, select all
    if (!selections) { selections = events.map(e => true) }

    return events.map((event, idx) => (
      <Card
        event={event}
        sourceError={this.props.sourceError}
        language={this.props.language}
        isLoading={this.props.isLoading}
        isSelected={selections[idx]}
        getNarrativeLinks={this.props.getNarrativeLinks}
        getCategoryGroup={this.props.getCategoryGroup}
        getCategoryColor={this.props.getCategoryColor}
        getCategoryLabel={this.props.getCategoryLabel}
        onViewSource={this.props.onViewSource}
        onHighlight={this.props.onHighlight}
        onSelect={this.props.onSelect}
      />
    ))
  }

  renderSelectedCards () {
    const { selected } = this.props
    if (selected.length > 0) {
      return this.renderCards(selected)
    }
    return null
  }

  renderNarrativeCards () {
    const { narrative } = this.props
    const showing = narrative.steps.slice(narrative.current)
    const selections = showing
      .map((_, idx) => (idx === 0))

    return this.renderCards(showing, selections)
  }

  renderCardStackHeader () {
    const headerLang = copy[this.props.language].cardstack.header

    return (
      <div
        id='card-stack-header'
        className='card-stack-header'
        onClick={() => this.props.onToggleCardstack()}
      >
        <button className='side-menu-burg is-active'><span /></button>
        <p className='header-copy top'>
          {`${this.props.selected.length} ${headerLang}`}
        </p>
      </div>
    )
  }

  renderCardStackContent () {
    return (
      <div id='card-stack-content' className='card-stack-content'>
        <ul>
          {this.renderSelectedCards()}
        </ul>
      </div>
    )
  }

  renderNarrativeContent () {
    return (
      <div id='card-stack-content' className='card-stack-content'>
        <ul>
          {this.renderNarrativeCards()}
        </ul>
      </div>
    )
  }

  render () {
    const { isCardstack, selected, narrative } = this.props

    if (selected.length > 0) {
      if (!narrative) {
        return (
          <div
            id='card-stack'
            className={`card-stack
            ${isCardstack ? '' : ' folded'}`
            }
          >
            {this.renderCardStackHeader()}
            {this.renderCardStackContent()}
          </div>
        )
      } else {
        return (
          <div
            id='card-stack'
            className={`card-stack narrative-mode
            ${isCardstack ? '' : ' folded'}`
            }
          >
            {this.renderNarrativeContent()}
          </div>
        )
      }
    }

    return <div />
  }
}

function mapStateToProps (state) {
  return {
    narrative: selectors.selectActiveNarrative(state),
    selected: selectors.selectSelected(state),
    sourceError: state.app.errors.source,
    language: state.app.language,
    isCardstack: state.app.flags.isCardstack,
    isLoading: state.app.flags.isFetchingSources
  }
}

export default connect(mapStateToProps)(CardStack)
