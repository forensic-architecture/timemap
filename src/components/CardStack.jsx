import React from 'react'
import { connect } from 'react-redux'
import * as selectors from '../selectors'
import {
  // calculateColorPercentages,
  getFilterIdxFromColorSet
} from '../common/utilities'

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
    const cardScroll = this.refs[this.props.narrative.current].current.offsetTop

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
      if (t < 1) return c / 2 * t * t + b
      t -= 1
      return -c / 2 * (t * (t - 2) - 1) + b
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
    if (!selections) { selections = events.map(e => true) }
    this.refs = []

    return events.map((event, idx) => {
      const thisRef = React.createRef()
      this.refs[idx] = thisRef

      let precision
      switch (event.location_precision) {
        case `Generalised`:
          precision = `No location data`
          break
        case `Estimated`:
          precision = `Precise location estimated`
          break
        case `Self-reported`:
          precision = `Location reported by witness`
          break
        case `Confirmed`:
        default:
          precision = null
          break
      }

      return (<Card
        // event={event}
        ref={thisRef}
        // sourceError={this.props.sourceError}
        content={[
          [{ kind: 'tag', align: 'end', value: `Incident #${event.incident_id}` }],
          [{ kind: 'line' }],
          [
            { kind: 'date', title: 'Incident Date', value: event.datetime },
            { kind: 'text', title: 'Location', hoverValue: precision, value: event.location }
          ],
          [{ kind: 'line-break', times: 0.4 }],
          [
            {
              kind: 'text',
              title: 'Summary',
              value: event.description,
              scaleFont: 1.1
            }
          ],
          [{ kind: 'line-break', times: 0.4 }],
          [
            {
              kind: 'button',
              title: 'Type of Violation',
              value: event.associations.slice(0, -1).map(association => ({
                text: association,
                color: getFilterIdxFromColorSet(association, this.props.coloringSet) >= 0 ? this.props.colors[getFilterIdxFromColorSet(association, this.props.coloringSet)] : null,
                normalCursor: true
              }))
            },
            {
              kind: 'button',
              title: 'Against',
              value: event.associations.slice(-1).map(category => ({
                text: category,
                color: null,
                normalCursor: true
              }))
            }
          ],
          [{ kind: 'line-break', times: 0.2 }],
          [
            {
              kind: 'list',
              title: 'Law Enforcement Agencies',
              value: event.le_agencys
            }
          ],
          [
            { kind: 'text', title: 'Name of reporter(s)', value: event.journalist_name },
            { kind: 'text', title: 'Network', value: event.news_organisation }
          ],
          [
            {
              kind: event.hide_source === 'FALSE' ? 'button' : 'markdown',
              title: 'Sources',
              value: event.hide_source === 'FALSE' ? event.links.map((href, idx) => ({ text: `Source ${idx + 1}`, href, color: null, onClick: () => window.open(href, '_blank') })) : 'Source hidden to protect the privacy and dignity of civilians. Read more [here](https://staging.forensic-architecture.org/wp-content/uploads/2020/09/2020.14.09-FA-Bcat-Mission-Statement.pdf).'
            }
          ]
          // [{ kind: "text", title: "Category", value: "Press attack" }],
        ]}
        language={this.props.language}
        isLoading={this.props.isLoading}
        isSelected={selections[idx]}
      // getNarrativeLinks={this.props.getNarrativeLinks}
      // getCategoryGroup={this.props.getCategoryGroup}
      // getCategoryColor={this.props.getCategoryColor}
      // getCategoryLabel={this.props.getCategoryLabel}
      // onViewSource={this.props.onViewSource}
      // onHighlight={this.props.onHighlight}
      // onSelect={this.props.onSelect}
      // features={this.props.features}
      />)
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

    const selections = showing
      .map((_, idx) => (idx === narrative.current))

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
      <div id='card-stack-content' className='card-stack-content'
        ref={this.refCardStackContent}
      >
        <ul>
          {this.renderNarrativeCards()}
        </ul>
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
            ref={this.refCardStack}
            className={`card-stack narrative-mode
            ${isCardstack ? '' : ' folded'}`
            }
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
