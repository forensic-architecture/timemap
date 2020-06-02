import React from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../actions'

import MediaOverlay from './Overlay/Media'
import LoadingOverlay from './Overlay/Loading'
import Map from './Map.jsx'
import Toolbar from './Toolbar/Layout'
import CardStack from './CardStack.jsx'
import NarrativeControls from './presentational/Narrative/Controls.js'
import InfoPopUp from './InfoPopup.jsx'
import Timeline from './Timeline.jsx'
import Notification from './Notification.jsx'
import StaticPage from './StaticPage'
import TemplateCover from './TemplateCover'

import { binarySearch } from '../common/utilities'
import { isMobile } from 'react-device-detect'

class Dashboard extends React.Component {
  constructor (props) {
    super(props)

    this.handleViewSource = this.handleViewSource.bind(this)
    this.handleHighlight = this.handleHighlight.bind(this)
    this.setNarrative = this.setNarrative.bind(this)
    this.moveInNarrative = this.moveInNarrative.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.getCategoryColor = this.getCategoryColor.bind(this)
  }

  componentDidMount () {
    if (!this.props.app.isMobile) {
      this.props.actions.fetchDomain()
        .then(domain => this.props.actions.updateDomain(domain))
        .then(({ domain }) => {
          if (domain.categories.length >= 4) {
            this.props.actions.updateDimensions({ marginTop: 0 })
          }
        })
    }
  }

  handleHighlight (highlighted) {
    this.props.actions.updateHighlighted((highlighted) || null)
  }

  handleViewSource (source) {
    this.props.actions.updateSource(source)
  }

  handleSelect (selected, axis) {
    const matchedEvents = []
    const TIMELINE_AXIS = 0
    if (axis === TIMELINE_AXIS) {
      matchedEvents.push(selected)
      // find in events
      const { events } = this.props.domain
      const idx = binarySearch(
        events,
        selected,
        (e1, e2) => {
          return e1.datetime - e2.datetime
        }
      )
      // check events before
      let ptr = idx - 1
      while (events[idx].datetime === events[ptr].datetime) {
        matchedEvents.push(events[ptr])
        ptr -= 1
      }
      // check events after
      ptr = idx + 1
      while (events[idx].datetime === events[ptr].datetime) {
        matchedEvents.push(events[ptr])
        ptr += 1
      }
    } else { // Map...
      const std = { ...selected }
      delete std.sources
      Object.values(std).forEach(ev => matchedEvents.push(ev))
    }

    this.props.actions.updateSelected(matchedEvents)
  }

  getCategoryColor (category) {
    const cat = this.props.ui.style.categories[category]
    if (cat) {
      return cat
    } else {
      return this.props.ui.style.categories['default']
    }
  }

  getNarrativeLinks (event) {
    const narrative = this.props.domain.narratives.find(nv => nv.id === event.narrative)
    if (narrative) return narrative.byId[event.id]
    return null
  }

  setNarrative (narrative) {
    // only handleSelect if narrative is not null
    if (narrative) {
      this.props.actions.clearFilter('tags')
      this.props.actions.clearFilter('categories')
      this.handleSelect([ narrative.steps[0] ])
    }
    this.props.actions.updateNarrative(narrative)
  }

  moveInNarrative (amt) {
    const { current } = this.props.app.narrativeState
    const { narrative } = this.props.app

    if (amt === 1) {
      this.handleSelect([ narrative.steps[current + 1] ])
      this.props.actions.incrementNarrativeCurrent()
    }
    if (amt === -1) {
      this.handleSelect([ narrative.steps[current - 1] ])
      this.props.actions.decrementNarrativeCurrent()
    }
  }

  render () {
    const { actions, app, domain, ui, features } = this.props

    if (isMobile || window.innerWidth < 1000) {
      return (
        <div>
          {features.USE_COVER && (
            <StaticPage showing={app.flags.isCover}>
              {/* enable USE_COVER in config.js features, and customise your header */}
              {/* pass 'actions.toggleCover' as a prop to your custom header */}
              <TemplateCover showAppHandler={() => {
                /* eslint-disable no-undef */
                alert('This platform is not suitable for mobile. Please re-visit the site on a device with a larger screen.')
                /* eslint-enable no-undef */
              }} />
            </StaticPage>
          )}
        </div>
      )
    }

    return (
      <div>
        <Toolbar
          isNarrative={!!app.narrative}
          methods={{
            onTitle: actions.toggleCover,
            onTagFilter: tag => actions.toggleFilter('tags', tag),
            onCategoryFilter: category => actions.toggleFilter('categories', category),
            onSelectNarrative: this.setNarrative
          }}
        />
        <Map
          methods={{
            onSelect: ev => this.handleSelect(ev, 1),
            onSelectNarrative: this.setNarrative,
            getCategoryColor: this.getCategoryColor
          }}
        />
        <Timeline
          methods={{
            onSelect: ev => this.handleSelect(ev, 0),
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
        <NarrativeControls
          narrative={app.narrative ? {
            ...app.narrative,
            current: app.narrativeState.current
          } : null}
          methods={{
            onNext: () => this.moveInNarrative(1),
            onPrev: () => this.moveInNarrative(-1),
            onSelectNarrative: this.setNarrative
          }}
        />
        <InfoPopUp
          ui={ui}
          app={app}
          methods={{
            onClose: actions.toggleInfoPopup
          }}
        />
        <Notification
          isNotification={app.flags.isNotification}
          notifications={domain.notifications}
          onToggle={actions.markNotificationsRead}
        />
        {app.source ? (
          <MediaOverlay
            source={app.source}
            onCancel={() => {
              actions.updateSource(null)
            }
            }
          />
        ) : null}
        {features.USE_COVER && (
          <StaticPage showing={app.flags.isCover}>
            {/* enable USE_COVER in config.js features, and customise your header */}
            {/* pass 'actions.toggleCover' as a prop to your custom header */}
            <TemplateCover showing={app.flags.isCover} showAppHandler={actions.toggleCover} />
          </StaticPage>
        )}
        <LoadingOverlay
          isLoading={app.loading || app.flags.isFetchingDomain}
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

export default connect(
  state => state,
  mapDispatchToProps
)(Dashboard)
