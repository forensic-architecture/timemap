import React from 'react'
import { connect } from 'react-redux'

import * as selectors from '../selectors'
import { getFilterIdxFromColorSet } from '../common/utilities'
// import Card from './Card.jsx'
import { Card } from '@forensic-architecture/design-system/react'
import copy from '../common/data/copy.json'

class CardStack extends React.Component {
  constructor () {
    super()
    this.refs = {}
    this.refCardStack = React.createRef()
    this.refCardStackContent = React.createRef()
  }

  componentDidUpdate () {
    const isNarrative = !!this.props.narrative

    if (isNarrative) {
      this.scrollToCard()
    }
  }

  scrollToCard () {
    const duration = 500
    const element = this.refCardStack.current
    const cardScroll = this.refs[this.props.narrative.current].current
      .offsetTop

    let start = element.scrollTop
    let change = cardScroll - start
    let currentTime = 0
    const increment = 20

    // t = current time
    // b = start value
    // c = change in value
    // d = duration
    Math.easeInOutQuad = function (t, b, c, d) {
      t /= d / 2
      if (t < 1) return (c / 2) * t * t + b
      t -= 1
      return (-c / 2) * (t * (t - 2) - 1) + b
    }

    const animateScroll = function () {
      currentTime += increment
      const val = Math.easeInOutQuad(currentTime, start, change, duration)
      element.scrollTop = val
      if (currentTime < duration) setTimeout(animateScroll, increment)
    }
    animateScroll()
  }

  renderCards (events, selections) {
    // if no selections provided, select all
    if (!selections) {
      selections = events.map((e) => true)
    }
    this.refs = []

    return events.map((event, idx) => {
      const thisRef = React.createRef()
      this.refs[idx] = thisRef

      return (
        <Card
          ref={thisRef}
          content={this.props.cardUI.layout({
            event,
            colors: this.props.colors,
            coloringSet: this.props.coloringSet,
            getFilterIdxFromColorSet
          })}
          language={this.props.language}
          isLoading={this.props.isLoading}
          isSelected={selections[idx]}
        />
      )
    })
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
    const showing = narrative.steps

    const selections = showing.map((_, idx) => idx === narrative.current)

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
        <button className='side-menu-burg is-active'>
          <span />
        </button>
        <p className='header-copy top'>
          {`${this.props.selected.length} ${headerLang}`}
        </p>
      </div>
    )
  }

  renderCardStackContent () {
    return (
      <div id='card-stack-content' className='card-stack-content'>
        <ul>{this.renderSelectedCards()}</ul>
      </div>
    )
  }

  renderNarrativeContent () {
    return (
      <div
        id='card-stack-content'
        className='card-stack-content'
        ref={this.refCardStackContent}
      >
        <ul>{this.renderNarrativeCards()}</ul>
      </div>
    )
  }

  render () {
    const { isCardstack, selected, narrative, timelineDims } = this.props
    // TODO: make '237px', which is the narrative header, less hard-coded
    const height = `calc(100% - 237px - ${timelineDims.height}px)`
    if (selected.length > 0) {
      if (!narrative) {
        return (
          <div
            id='card-stack'
            className={`card-stack
            ${isCardstack ? '' : ' folded'}`}
          >
            {this.renderCardStackHeader()}
            {this.renderCardStackContent()}
          </div>
        )
      } else {
        return (
          <div
            id='card-stack'
            ref={this.refCardStack}
            className={`card-stack narrative-mode
            ${isCardstack ? '' : ' folded'}`}
            style={{ height }}
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
    isLoading: state.app.flags.isFetchingSources,
    cardUI: state.ui.card,
    colors: state.ui.coloring.colors,
    coloringSet: state.app.associations.coloringSet,
    features: state.features
  }
}

export default connect(mapStateToProps)(CardStack)
