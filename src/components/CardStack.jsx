import React from 'react'
import { connect } from 'react-redux'
import * as selectors from '../selectors'

import Card from './Card.jsx'
import copy from '../js/data/copy.json'
import {
  isNotNullNorUndefined
} from '../js/utilities.js'

class CardStack extends React.Component {
  renderCards(events) {
    return events.map(event => (
      <Card
        event={event}
        sourceError={this.props.sourceError}
        language={this.props.language}
        isLoading={this.props.isLoading}
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

  renderSelectedCards() {
    const { selected } = this.props
    if (selected.length > 0) {
      return this.renderCards(selected)
    }
    return null
  }

  renderNarrativeCards() {
    const { narrative } = this.props
    return this.renderCards(narrative.steps)
  }

  renderCardStackHeader() {
    const header_lang = copy[this.props.language].cardstack.header

    return (
      <div
        id='card-stack-header'
        className='card-stack-header'
        onClick={() => this.props.onToggleCardstack()}
      >
        <button className="side-menu-burg is-active"><span></span></button>
        <p className="header-copy top">
          {`${this.props.selected.length} ${header_lang}`}
        </p>
      </div>
    )
  }

  renderCardStackContent() {
    return (
      <div id="card-stack-content" className="card-stack-content">
        <ul>
          {this.renderSelectedCards()}
        </ul>
      </div>
    )
  }

  renderNarrativeContent() {
    return (
      <div id="card-stack-content" className="card-stack-content">
        <ul>
          {this.renderNarrativeCards()}
        </ul>
      </div>
    )
  }

  render() {
    const { isCardstack, selected, narrative } = this.props

    if (selected.length > 0) {
      if (!narrative) {
        return (
          <div
            id="card-stack"
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
            id="card-stack"
            className={`card-stack narrative-mode
            ${isCardstack ? '' : ' folded'}`
            }
          >
            {this.renderNarrativeContent()}
          </div>
        )
      }
    }

    return <div/>
  }
}

function mapStateToProps(state) {
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
