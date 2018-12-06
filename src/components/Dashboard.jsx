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
    // this.handleToggle = this.handleToggle.bind(this);
    this.handleTagFilter = this.handleTagFilter.bind(this);
    this.updateTimerange = this.updateTimerange.bind(this);

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
      let eventsToSelect = selected.map(event => this.getEventById(event.id));
      const p = this.props.ui.tools.parser;

      eventsToSelect = eventsToSelect.sort((a, b) => p(a.timestamp) - p(b.timestamp))

      this.props.actions.fetchSelected(eventsToSelect)
    }
  }

  handleTagFilter(tag) {
    this.props.actions.updateTagFilters(tag);
  }

  updateTimerange(timeRange) {
    this.props.actions.updateTimeRange(timeRange);
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
            onSelect: this.handleSelect,
            getCategoryColor: category => this.getCategoryColor(category)
          }}
        />
        <Toolbar
          onFilter={this.handleTagFilter}
          actions={this.props.actions}
        />
        <CardStack
          onSelect={this.handleSelect}
          onHighlight={this.handleHighlight}
          onToggleCardstack={() => this.props.actions.updateSelected([])}
          getNarrativeLinks={event => this.getNarrativeLinks(event)}
          getCategoryColor={category => this.getCategoryColor(category)}
        />
        <Timeline
          methods={{
            onSelect: this.handleSelect,
            onUpdateTimerange: this.updateTimerange,
            getCategoryColor: category => this.getCategoryColor(category)
          }}
        />
        <InfoPopUp
          ui={this.props.ui}
          app={this.props.app}
          toggle={() => this.props.actions.toggleInfoPopup()}
        />
        <Notification
          isNotification={this.props.ui.flags.isNotification}
          notifications={this.props.domain.notifications}
          onToggle={this.props.actions.markNotificationsRead}
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
