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

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.handleViewSource = this.handleViewSource.bind(this)
    this.handleHighlight = this.handleHighlight.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSelectNarrative = this.handleSelectNarrative.bind(this);
    this.handleTagFilter = this.handleTagFilter.bind(this);
    this.updateTimerange = this.updateTimerange.bind(this);
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

  handleSelectNarrative(narrative) {
    this.props.actions.updateNarrative(narrative);
  }

  handleTagFilter(tag) {
    this.props.actions.updateTagFilters(tag);
  }

  updateTimerange(timeRange) {
    this.props.actions.updateTimeRange(timeRange);
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
    return (
      <div>
        <Toolbar
          onFilter={this.handleTagFilter}
          onSelectNarrative={this.handleSelectNarrative}
          actions={this.props.actions}
        />
        <Map
          mapId="map"
          methods={{
            onSelect: this.handleSelect,
            onSelectNarrative: this.handleSelectNarrative,
            getCategoryColor: this.getCategoryColor,
          }}
        />
        <Timeline
          methods={{
            onSelect: this.handleSelect,
            onUpdateTimerange: this.updateTimerange,
            getCategoryColor: category => this.getCategoryColor(category)
          }}
        />
        {(this.props.app.narrative !== null)
            ? <NarrativeCard
              onSelect={this.handleSelect}
              onSelectNarrative={this.handleSelectNarrative}
            />
            : ''
        }
        <CardStack
          onViewSource={this.handleViewSource}
          onSelect={this.handleSelect}
          onHighlight={this.handleHighlight}
          onToggleCardstack={() => this.props.actions.updateSelected([])}
          getNarrativeLinks={event => this.getNarrativeLinks(event)}
          getCategoryColor={category => this.getCategoryColor(category)}
        />
        <InfoPopUp
          ui={this.props.ui}
          app={this.props.app}
          toggle={() => this.props.actions.toggleInfoPopup()}
        />
        <Notification
          isNotification={this.props.app.flags.isNotification}
          notifications={this.props.domain.notifications}
          onToggle={this.props.actions.markNotificationsRead}
        />
        {this.props.app.source ? (
          <SourceOverlay
            source={this.props.app.source}
            onCancel={() => {
              this.props.actions.updateSource(null)}
            }
          />
        ) : null}
        <LoadingOverlay
          ui={this.props.app.flags.isFetchingDomain}
          language={this.props.app.language}
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

export default connect(
  // state => ({
  //   ...state,
  //   app: {
  //     ...state.app,
  //     source: state.domain.sources["Anna News - Horbatenko Tanks Video"]
  //   }
  // }),
  state => state,
  mapDispatchToProps,
)(Dashboard);
