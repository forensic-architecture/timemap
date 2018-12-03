import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions';
import * as selectors from '../selectors';

import LoadingOverlay from './presentational/LoadingOverlay';
import Viewport from './Viewport.jsx';
import Toolbar from './Toolbar.jsx';
import CardStack from './CardStack.jsx';
import InfoPopUp from './InfoPopup.jsx';
import Timeline from './Timeline.jsx';
import Notification from './Notification.jsx';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.handleHighlight = this.handleHighlight.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleTagFilter = this.handleTagFilter.bind(this);
    this.handleTimeFilter = this.handleTimeFilter.bind(this);

    this.eventsById = {};
  }

  componentDidMount() {
    if (!this.props.app.isMobile) {
      this.props.actions.fetchDomain()
        .then((domain) => this.props.actions.updateDomain(domain));
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

  handleSelect(selected) {
    if (selected) {
      let eventsToSelect = selected.map(eventId => this.getEventById(eventId));
      const parser = this.props.ui.tools.parser;

      eventsToSelect = eventsToSelect.sort((a, b) => {
        return parser(a.timestamp) - parser(b.timestamp);
      });

      if (eventsToSelect.every(event => (event))) {
        this.props.actions.updateSelected(eventsToSelect);
      }

      // Now fetch detail data for each event
      // Add transmitter and receiver data for coevents
      this.props.actions.fetchEvents(selected)
        .then((events) => {
          let eventsSelected = events.map(ev => {
            return Object.assign({}, ev, this.getEventById(ev.id));
          });

          eventsSelected = eventsSelected.sort((a, b) => {
            return parser(a.timestamp) - parser(b.timestamp);
          });

          this.props.actions.updateSelected(eventsSelected);
        });
    } else {
      this.props.actions.updateSelected([]);
    }
  }

  handleTagFilter(tag) {
    this.props.actions.updateTagFilters(tag);
  }

  handleTimeFilter(timeRange) {
    this.props.actions.updateTimeRange(timeRange);
  }

  handleToggle( key ) {
    switch( key ) {
      case 'TOGGLE_CARDSTACK': {
        this.props.actions.updateSelected([]);
        break;
      }
      case 'TOGGLE_INFOPOPUP': {
        this.props.actions.toggleInfoPopup();
        break;
      }
      case 'TOGGLE_NOTIFICATIONS': {
        this.props.actions.toggleNotifications();
        break;
      }
    }
  }

  getCategoryColor(category='other') {
    return this.props.ui.style.categories[category] || this.props.style.categories['other']
  }

  getNarrativeLinks(event) {
    const narrative = this.props.domain.narratives.find(nv => nv.key === event.narrative);
    if (narrative) return narrative.byId[event.id];
    return null;
  }

  render() {
    return (
      <div>
      <Viewport
          methods={{
            select: this.handleSelect,
            highlight: this.handleHighlight,
            getCategoryColor: category => this.getCategoryColor(category)
          }}
        />
        <Toolbar
          filter={this.handleTagFilter}
          toggle={ (key) => this.handleToggle(key) }
          actions={this.props.actions}
        />
        <CardStack
          select={this.handleSelect}
          highlight={this.handleHighlight}
          toggle={this.handleToggle}
          getNarrativeLinks={event => this.getNarrativeLinks(event)}
          getCategoryColor={category => this.getCategoryColor(category)}
        />
        <Timeline
          select={this.handleSelect}
          filter={this.handleTimeFilter}
          highlight={this.handleHighlight}
          toggle={() => this.handleToggle('TOGGLE_CARDSTACK')}
          getCategoryColor={category => this.getCategoryColor(category)}
        />
        <InfoPopUp
          ui={this.props.ui}
          app={this.props.app}
          toggle={() => this.handleToggle('TOGGLE_INFOPOPUP')}
        />
        <Notification
          isNotification={this.props.ui.flags.isNotification}
          notifications={this.props.domain.notifications}
          toggle={() => this.handleToggle('TOGGLE_NOTIFICATIONS')}
        />
        <LoadingOverlay
          ui={this.props.ui.flags.isFetchingDomain}
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
  state => state,
  mapDispatchToProps,
)(Dashboard);
