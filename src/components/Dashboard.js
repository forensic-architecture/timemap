import React from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as selectors from '../selectors'
import * as actions from '../actions'

import SourceOverlay from './SourceOverlay.js'
import LoadingOverlay from './presentational/LoadingOverlay'
import Map from './Map'
import Toolbar from './Toolbar'
import CardStack from './CardStack'
import Narrative from './Narrative'
import InfoPopUp from './InfoPopup'
import Timeline from './Timeline'
import Notification from './Notification'

class Dashboard extends React.Component {
  constructor (props) {
    super(props)

    this.handleViewSource = this.handleViewSource.bind(this)
    this.handleHighlight = this.handleHighlight.bind(this)
    this.setNarrative = this.setNarrative.bind(this)
    this.moveInNarrative = this.moveInNarrative.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.getCategoryColor = this.getCategoryColor.bind(this)

    this.eventsById = {}
  }

  componentDidMount () {
    if (!this.props.app.isMobile) {
      this.props.actions.fetchDomain()
        .then(domain => this.props.actions.updateDomain(domain))
    }
  }

  handleHighlight (highlighted) {
    this.props.actions.updateHighlighted((highlighted) || null)
  }

  getEventById (eventId) {
    if (this.eventsById[eventId]) return this.eventsById[eventId]
    this.eventsById[eventId] = this.props.domain.events.find(ev => ev.id === eventId)
    return this.eventsById[eventId]
  }

  handleViewSource (source) {
    this.props.actions.updateSource(source)
  }

  handleSelect (selected) {
    if (selected) {
      /* let eventsToSelect = selected.map(event => this.getEventById(event.id))
      eventsToSelect = eventsToSelect.sort((a, b) => parseDate(a.timestamp) - parseDate(b.timestamp))

      this.props.actions.updateSelected(eventsToSelect) */
      this.props.actions.updateSelected(selected)
    }
  }

  getCategoryColor (category) {
    return this.props.ui.style.categories[category] || this.props.ui.style.categories['default']
  }

  getNarrativeLinks (event) {
    const narrative = this.props.domain.narratives.find(nv => nv.id === event.narrative)
    if (narrative) return narrative.byId[event.id]
    return null
  }

  setNarrative (narrative) {
    // only handleSelect if narrative is not null
    if (narrative) { this.handleSelect([ +narrative.steps[0].id ]) }
    this.props.actions.updateNarrative(narrative)
  }

  moveInNarrative (amt) {
    const { current } = this.props.app.narrativeState
    const { narrative } = this.props.domain

    if (amt === 1) {
      this.handleSelect([ +narrative.steps[current + 1].id ])
      this.props.actions.incrementNarrativeCurrent()
    }
    if (amt === -1) {
      this.handleSelect([ +narrative.steps[current - 1].id ])
      this.props.actions.decrementNarrativeCurrent()
    }
  }

  render () {
    const { actions, app, domain, ui } = this.props

    return (
      <div>
        <Toolbar
          isNarrative={!!app.narrative}
          methods={{
            onTagFilter: actions.updateTagFilters,
            onCategoryFilter: actions.updateCategoryFilters,
            onSelectNarrative: this.setNarrative
          }}
        />
        <Map
          methods={{
            onSelect: this.handleSelect,
            onSelectNarrative: this.setNarrative,
            getCategoryColor: this.getCategoryColor
          }}
        />
        <Timeline
          methods={{
            onSelect: this.handleSelect,
            onUpdateTimerange: actions.updateTimeRange,
            getCategoryColor: category => this.getCategoryColor(category)
          }}
        />
        <CardStack
          onViewSource={this.handleViewSource}
          onSelect={this.handleSelect}
          onHighlight={this.handleHighlight}
          onToggleCardstack={() => actions.updateSelected([])}
          getNarrativeLinks={event => this.getNarrativeLinks(event)}
          getCategoryColor={category => this.getCategoryColor(category)}
        />
        <Narrative
          methods={{
            onNext: () => this.moveInNarrative(1),
            onPrev: () => this.moveInNarrative(-1),
            onSelectNarrative: this.setNarrative
          }}
        />
        <InfoPopUp
          ui={ui}
          app={app}
          toggle={() => actions.toggleInfoPopup()}
        />
        <Notification
          isNotification={app.flags.isNotification}
          notifications={domain.notifications}
          onToggle={actions.markNotificationsRead}
        />
        {app.source ? (
          <SourceOverlay
            source={app.source}
            onCancel={() => {
              actions.updateSource(null)
            }
            }
          />
        ) : null}
        <LoadingOverlay
          ui={app.flags.isFetchingDomain}
          language={app.language}
        />
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

function mapStateToProps (state, ownProps) {
  return {
    domain: {
      ...state.domain,
      narrative: selectors.selectActiveNarrative(state)
    },
    app: { ...state.app },
    ui: { ...state.ui },
    ...ownProps
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
