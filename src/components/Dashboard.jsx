import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions';

import SourceOverlay from './SourceOverlay.jsx';
import LoadingOverlay from './presentational/LoadingOverlay';
import Map from './Map.jsx';
import Toolbar from './Toolbar.jsx';
import CardStack from './CardStack.jsx';
import NarrativeCard from './NarrativeCard.js';
import InfoPopUp from './InfoPopup.jsx';
import Timeline from './Timeline.jsx';
import Notification from './Notification.jsx';

import { parseDate } from '../js/utilities';

import { injectNarrative } from '../js/utilities'

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.handleViewSource = this.handleViewSource.bind(this)
    this.handleHighlight = this.handleHighlight.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.getCategoryColor = this.getCategoryColor.bind(this);

    this.eventsById = {}
  }

  componentDidMount() {
    if (!this.props.app.isMobile) {
      this.props.actions.fetchDomain()
        .then(domain => this.props.actions.updateDomain(domain));
    }
  }

  handleHighlight(highlighted) {
    this.props.actions.updateHighlighted((highlighted) ? highlighted : null);
  }

  getEventById(eventId) {
    if (this.eventsById[eventId]) return this.eventsById[eventId];
    this.eventsById[eventId] = this.props.domain.events.find(ev => ev.id === eventId);
    return this.eventsById[eventId];
  }

  handleViewSource(source) {
    this.props.actions.updateSource(source)
  }

  handleSelect(selected) {
    if (selected) {
      let eventsToSelect = selected.map(event => this.getEventById(event.id));
      eventsToSelect = eventsToSelect.sort((a, b) => parseDate(a.timestamp) - parseDate(b.timestamp))

      this.props.actions.updateSelected(eventsToSelect)
    }
  }

  getCategoryColor(category='other') {
    return this.props.ui.style.categories[category] || this.props.ui.style.categories['other']
  }

  getNarrativeLinks(event) {
    const narrative = this.props.domain.narratives.find(nv => nv.id === event.narrative);
    if (narrative) return narrative.byId[event.id];
    return null;
  }

  render() {
    const { actions, app, domain, ui } = this.props
    return (
      <div>
        <Toolbar
          isNarrative={!!app.narrative}
          methods={{
            onFilter: actions.updateTagFilters,
            onSelectNarrative: actions.updateNarrative
          }}
        />
        <Map
          mapId='map'
          methods={{
            onSelect: this.handleSelect,
            onSelectNarrative: actions.updateNarrative,
            getCategoryColor: this.getCategoryColor,
          }}
        />
        <Timeline
          methods={{
            onSelect: this.handleSelect,
            onUpdateTimerange: actions.updateTimeRange,
            getCategoryColor: category => this.getCategoryColor(category)
          }}
        />
        <NarrativeCard
          methods={{
            onNext: actions.incrementNarrativeCurrent,
            onPrev: actions.decrementNarrativeCurrent,
            onSelect: this.handleSelect,
            onSelectNarrative: actions.updateNarrative
          }}
        />
        <CardStack
          isNarrative={!!app.narrative}
          onViewSource={this.handleViewSource}
          onSelect={this.handleSelect}
          onHighlight={this.handleHighlight}
          onToggleCardstack={() => actions.updateSelected([])}
          getNarrativeLinks={event => this.getNarrativeLinks(event)}
          getCategoryColor={category => this.getCategoryColor(category)}
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
              actions.updateSource(null)}
            }
          />
        ) : null}
        <LoadingOverlay
          ui={app.flags.isFetchingDomain}
          language={app.language}
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

function injectSource(id) {
  return state => ({
    ...state,
    app: {
      ...state.app,
      source: state.domain.sources[id]
    }
  })
}

export default connect(
  state => state,
  mapDispatchToProps,
)(Dashboard);
