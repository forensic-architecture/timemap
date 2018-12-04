import React from 'react';
import { connect } from 'react-redux'
import * as selectors from '../selectors'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Search from './Search.jsx';
import TagListPanel from './TagListPanel.jsx';
import SitesIcon from './presentational/Icons/SitesIcon.js';
import RefreshIcon from './presentational/Icons/RefreshIcon.js';
import CoeventIcon from './presentational/Icons/CoeventIcon.js';
import RouteIcon from './presentational/Icons/RouteIcon.js';
import copy from '../js/data/copy.json';
// NB: i think this entire component can actually be part of a future feature...

class Toolbar extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        tabNum: -1
      };
    }

    toggleTab(tabNum) {
      this.setState({ tabNum: (this.state.tabNum === tabNum) ? -1 : tabNum });
    }

    resetAllFilters() {
      this.props.actions.resetAllFilters();
    }

    toggleInfoPopup() {
      this.props.actions.toggleInfoPopup();
    }

    toggleLanguage() {
      this.props.actions.toggleLanguage();
    }

    toggleMapViews(layer) {
      this.props.actions.toggleMapView(layer);
    }

    toggleGuidedMode() {
      this.props.actions.toggleGuidedMode();
    }

    renderMapActions() {
      return (
        <div className="bottom-action-block">
            <RouteIcon
              onClick={(view) => this.toggleMapViews(view)}
              isEnabled={this.props.viewFilters.routes}
            />
            <SitesIcon
              onClick={(view) => this.toggleMapViews(view)}
              isEnabled={this.props.viewFilters.sites}
            />
            <CoeventIcon
              onClick={(view) => this.toggleMapViews(view)}
              isEnabled={this.props.viewFilters.coevents}
            />
        </div>
      );
    }

    renderBottomActions() {
      return (
        <div className="bottom-actions">
          <button onClick={() => { this.toggleGuidedMode(); }}>Toggle mode</button>
          {/*}{this.renderMapActions()}
          <div className="bottom-action-block">
            <button className="action-button tiny default" onClick={() => { this.toggleLanguage()}}>
              {(this.props.language === 'es-MX') ? 'ES' : 'EN' }
            </button>
            <button className="action-button info tiny default" onClick={() => { this.toggleInfoPopup()}}>
              i
            </button>
            <button className="action-button tiny" onClick={() => this.resetAllFilters()}>
              <RefreshIcon />
            </button>
          </div>*/}
        </div>
      );
    }


  renderPanelHeader() {
    return (
      <div className="panel-header" onClick={() => this.toggleTab(-1)}>
        <div className="caret"></div>
      </div>
     );
  }

  renderToolbarTab(tabNum, key) {
    const isActive = (tabNum === this.state.tab);

    let classes = (isActive) ? 'toolbar-tab active' : 'toolbar-tab';
    return (
      <div className={classes} onClick={() => { this.toggleTab(tabNum); }}>
        <div className="tab-caption">{key}</div>
      </div>
    );
  }

  renderToolbarTagRoot() {
    if (this.props.features.USE_TAGS &&
      this.props.tags.children) {
      const roots = Object.values(this.props.tags.children);
      return roots.map((root, idx) => {
        return this.renderToolbarTab(idx, root.key);
      })
    }
    return '';
  }

  renderTagListPanel(tagType) {
      const panels_lang = copy[this.props.language].toolbar.panels;
      const title = (panels_lang[tagType]) ? panels_lang[tagType].title : tagType;
      const overview = (panels_lang[tagType]) ? panels_lang[tagType].overview : '';

      return (
        <TagListPanel
          tags={this.props.tags}
          categories={this.props.categories}
          tagFilters={this.props.tagFilters}
          categoryFilters={this.props.categoryFilters}
          filter={this.props.onFilter}
          title={title}
          overview={overview}
          language={this.props.language}
          tagType={tagType}
        />
       );
  }

  renderToolbarNarrativePanel() {
    return (
      <TabPanel>
        <h2>Focus stories</h2>
        <p>Here are some highlighted stories</p>
        {this.props.narratives.map((narr) => {
          return (
            <div className="panel-action action">
              <button style={{ backgroundColor: '#000' }}>
                <p>{narr.label}</p>
                <p><small>{narr.description}</small></p>
              </button>
            </div>
          )
        })}
      </TabPanel>
    );
  }

  renderSearch() {
    if (this.props.features.USE_SEARCH) {
      return (
        <TabPanel>
            <Search
              language={this.props.language}
              tags={this.props.tags}
              categories={this.props.categories}
              tagFilters={this.props.tagFilters}
              categoryFilters={this.props.categoryFilters}
              filter={this.props.onFilter}
            />
        </TabPanel>
      )
    }
  }

  renderToolbarTagList() {
    if (this.props.features.USE_TAGS &&
      this.props.tags.children) {
      const roots = Object.values(this.props.tags.children);
      return roots.map((root, idx) => {
        return (
          <TabPanel>
              {this.renderTagListPanel(root.key)}
          </TabPanel>
        )
      })
    }
    return '';
  }

  renderToolbarNarratives() {
    const isActive = (this.state.tabNum === 0);
    let classes = (isActive) ? 'toolbar-tab active' : 'toolbar-tab';

    return (
      <div className={classes} onClick={() => { this.toggleTab(0); }}>
        <div className="tab-caption">Focus stories</div>
      </div>
    );
  }

  renderToolbarTags() {
    const isActive = (this.state.tabNum === 1);
    let classes = (isActive) ? 'toolbar-tab active' : 'toolbar-tab';

    return (
      <div className={classes} onClick={() => { this.toggleTab(1); }}>
        <div className="tab-caption">Explore freely</div>
      </div>
    );
  }

  renderToolbarTabs() {
    const title = copy[this.props.language].toolbar.title;
    return (
      <div className="toolbar">
        <div className="toolbar-header"><p>{title}</p></div>
        <div className="toolbar-tabs">
          {/*this.renderToolbarTab(0, 'search')*/}
          {this.renderToolbarNarratives()}
          {this.renderToolbarTags()}
        </div>
        {this.renderBottomActions()}
      </div>
    )
  }

  renderToolbarPanels() {
    let classes = (this.state.tabNum !== -1) ? 'toolbar-panels' : 'toolbar-panels folded';

    return (
      <div className={classes}>
        {this.renderPanelHeader()}
        <Tabs selectedIndex={this.state.tabNum}>
          {this.renderToolbarNarrativePanel()}
          {this.renderToolbarTagList()}
        </Tabs>
      </div>
    )
  }

  render() {
    return (
      <div id="toolbar-wrapper" className="toolbar-wrapper">
        {this.renderToolbarTabs()}
        {this.renderToolbarPanels()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tags: selectors.getTagTree(state),
    categories: selectors.selectCategories(state),
    narratives: selectors.selectNarratives(state),
    language: state.app.language,
    tagFilters: selectors.selectTagList(state),
    categoryFilter: state.app.filters.categories,
    viewFilters: state.app.filters.views,
    features: state.app.features,
    isModeGuided: state.app.isModeGuided
  }
}

export default connect(mapStateToProps)(Toolbar)
