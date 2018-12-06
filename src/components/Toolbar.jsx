import React from 'react';
import { connect } from 'react-redux'
import * as selectors from '../selectors'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Search from './Search.jsx';
import TagListPanel from './TagListPanel.jsx';
import ToolbarBottomActions from './ToolbarBottomActions.jsx';
import copy from '../js/data/copy.json';

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

  renderClosePanel() {
    return (
      <div className="panel-header" onClick={() => this.toggleTab(-1)}>
        <div className="caret"></div>
      </div>
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
            filter={this.props.filter}
          />
        </TabPanel>
      )
    }
  }

  goToNarrative(narrative) {
    this.setState({
      tabNum: -1
    }, () => {
      this.props.actions.updateNarrative(narrative);
    });
  }

  renderToolbarNarrativePanel() {
    return (
      <TabPanel>
        <h2>Focus stories</h2>
        <p>Here are some highlighted stories</p>
        {this.props.narratives.map((narr) => {
          return (
            <div className="panel-action action">
              <button style={{ backgroundColor: '#000' }} onClick={() => { this.goToNarrative(narr); }}>
                <p>{narr.label}</p>
                <p><small>{narr.description}</small></p>
              </button>
            </div>
          )
        })}
      </TabPanel>
    );
  }

  renderToolbarTagPanel() {
    if (this.props.features.USE_TAGS &&
      this.props.tags.children) {
      return (
        <TabPanel>
          <TagListPanel
            tags={this.props.tags}
            categories={this.props.categories}
            tagFilters={this.props.tagFilters}
            categoryFilters={this.props.categoryFilters}
            filter={this.props.filter}
            language={this.props.language}
          />
        </TabPanel>
      )
    }
    return '';
  }

  renderToolbarTab(tabNum, label) {
    const isActive = (this.state.tabNum === tabNum);
    let classes = (isActive) ? 'toolbar-tab active' : 'toolbar-tab';

    return (
      <div className={classes} onClick={() => { this.toggleTab(tabNum); }}>
        <div className="tab-caption">{label}</div>
      </div>
    );
  }

  renderToolbarTabs() {
    const title = copy[this.props.language].toolbar.title;
    const isTags = this.props.tags && (this.props.tags.children > 0);

    return (
      <div className="toolbar">
        <div className="toolbar-header"><p>{title}</p></div>
        <div className="toolbar-tabs">
          {/*this.renderToolbarTab(0, 'search')*/}
          {this.renderToolbarTab(0, 'Narratives')}
          {(isTags) ? this.renderToolbarTab(1, 'Explore by tag') : ''}
        </div>
        <ToolbarBottomActions
          actions={this.props.actions}
        />
      </div>
    )
  }

  renderToolbarPanels() {
    let classes = (this.state.tabNum !== -1) ? 'toolbar-panels' : 'toolbar-panels folded';

    return (
      <div className={classes}>
        {this.renderClosePanel()}
        <Tabs selectedIndex={this.state.tabNum}>
          {this.renderToolbarNarrativePanel()}
          {this.renderToolbarTagPanel()}
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
