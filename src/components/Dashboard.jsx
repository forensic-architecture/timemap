import '../scss/main.scss';
import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions';
import * as selectors from '../selectors';

import LoadingOverlay from './LoadingOverlay.jsx';
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
    }

    componentDidMount() {
      if (!this.props.app.isMobile) {
        this.props.actions.fetchDomain()
          .then((domain) => this.props.actions.updateDomain(domain))
      }
    }

    handleHighlight(highlighted) {
      this.props.actions.updateHighlighted((highlighted) ? highlighted : null);
    }

    handleSelect(selected) {
      if (selected) {
        // attacks are not susceptible to tag filters, so make sure this happens only when they are found
        // in the domain
        let eventsToSelect = selected.map(eventId => this.props.domain.events[eventId]);
        eventsToSelect = eventsToSelect.sort((a, b) => {
          return this.props.ui.tools.parser(a.timestamp) - this.props.ui.tools.parser(b.timestamp);
        });

        if (eventsToSelect.every(event => (event))) {
          this.props.actions.updateSelected(eventsToSelect);
        }

        // Now fetch detail data for each event
        // Add transmitter and receiver data for coevents
        this.props.actions.fetchEvents(selected)
          .then((events) => {
            let eventsSelected = events.map(ev => {
              return Object.assign({}, ev, this.props.domain.events[ev.id]);
            });

            eventsSelected = eventsSelected.sort((a, b) => {
              return this.props.ui.tools.parser(a.timestamp) - this.props.ui.tools.parser(b.timestamp);
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

    getCategoryGroup(category) {
      const cat = this.props.domain.categories.find(t => t.category === category)
      if (cat) return cat.group;
      return 'other';
    }

    getCategoryGroupColor(category) {
      const group = this.getCategoryGroup(category);
      return this.props.ui.style.groupColors[group];
    }

    getCategoryLabel(category) {
      const label = this.props.domain.categories.find(t => t.category === category).category_label;
      return label;
    }

    renderTool() {
      return (<div>
        <Viewport
          locations={this.props.domain.locations}
          sites={this.props.domain.sites}
          categoryGroups={this.props.domain.categoryGroups}

          views={this.props.app.filters.views}
          selected={this.props.app.selected}
          highlighted={this.props.app.highlighted}
          mapAnchor={this.props.app.mapAnchor}

          uiStyle={this.props.ui.style}
          dom={this.props.ui.dom}
          isView2d={this.props.ui.flags.isView2d}

          select={this.handleSelect}
          highlight={this.handleHighlight}
          getCategoryGroup={category => this.getCategoryGroup(category)}
          getCategoryGroupColor={category => this.getCategoryGroupColor(category)}
        />
        <Toolbar
          tags={this.props.domain.tags}
          categories={this.props.domain.categories}

          language={this.props.app.language}
          tagFilters={this.props.app.filters.tags}
          categoryFilter={this.props.app.filters.categories}
          viewFilters={this.props.app.filters.views}
          features={this.props.app.features}

          isToolbar={this.props.ui.flags.isToolbar}
          toolbarTab={this.props.ui.components.toolbarTab}
          isView2d={this.props.ui.flags.isView2d}

          filter={this.handleTagFilter}
          toggle={ (key) => this.handleToggle(key) }
          actions={this.props.actions}
        />
        <CardStack
          selected={this.props.app.selected}
          language={this.props.app.language}

          tools={this.props.ui.tools}
          isCardstack={this.props.ui.flags.isCardstack}
          isFetchingEvents={this.props.ui.flags.isFetchingEvents}

          highlight={this.handleHighlight}
          toggle={this.handleToggle}
          getCategoryGroup={category => this.getCategoryGroup(category)}
          getCategoryGroupColor={category => this.getCategoryGroupColor(category)}
          getCategoryLabel={category => this.getCategoryLabel(category)}
        />
        <Timeline
          events={this.props.domain.events.filter(item => item)}
          categoryGroups={this.props.domain.categoryGroups}

          range={this.props.app.filters.range}
          selected={this.props.app.selected}
          language={this.props.app.language}

          tools={this.props.ui.tools}
          dom={this.props.ui.dom}

          select={this.handleSelect}
          filter={this.handleTimeFilter}
          highlight={this.handleHighlight}
          toggle={() => this.handleToggle('TOGGLE_CARDSTACK')}
          getCategoryGroup={category => this.getCategoryGroup(category)}
          getCategoryGroupColor={category => this.getCategoryGroupColor(category)}
          getCategoryLabel={category => this.getCategoryLabel(category)}
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
          ui={this.props.ui}
          language={this.props.app.language}
        />
      </div>
    )
  }

  render() {
    return (<div>{this.renderTool()}</div>);
  }
}

function mapStateToProps(state) {
  return Object.assign({}, state, {
    domain: Object.assign({}, state.domain, {

      events: selectors.getFilteredEvents(state),
      locations: selectors.getFilteredLocations(state),
      categories: selectors.getFilteredCategories(state),
      categoryGroups: selectors.getCategoryGroups(state),
      sites: selectors.getSites(state),
      tags: selectors.getAllTags(state),

      notifications: state.domain.notifications,
    }),
    app: Object.assign({}, state.app, {
      error: state.app.error,
      filters: Object.assign({}, state.app.filters, {
        range: selectors.getRangeFilter(state),
        tags: selectors.getTagFilters(state)
      })
    }),
    ui: state.ui
  });
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard);
