import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../actions'
import * as selectors from '../selectors'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Search from './Search.jsx';
import TagListPanel from './TagListPanel.jsx';
import ToolbarBottomActions from './ToolbarBottomActions.jsx';
import copy from '../js/data/copy.json';
import { trimAndEllipse } from '../js/utilities.js';

class Toolbar extends React.Component {
  constructor(props) {
    super(props)
    this.state = { _selected: -1 }
  }

  selectTab(selected) {
    const _selected = (this.state._selected === selected) ? -1 : selected
    this.setState({ _selected });
  }

  renderClosePanel() {
    return (
      <div className="panel-header" onClick={() => this.selectTab(-1)}>
        <div className="caret"></div>
      </div>
     );
  }

  renderSearch() {
    if (process.env.features.USE_SEARCH) {
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
    this.selectTab(-1) // set all unselected within this component
    this.props.methods.onSelectNarrative(narrative);
  }

  renderToolbarNarrativePanel() {
    return (
      <TabPanel>
        <h2>{copy[this.props.language].toolbar.narrative_panel_title}</h2>
        <p>{copy[this.props.language].toolbar.narrative_summary}</p>
        {this.props.narratives.map((narr) => {
          return (
            <div className="panel-action action">
              <button style={{ backgroundColor: '#000' }} onClick={() => { this.goToNarrative(narr) }}>
                <p>{narr.label}</p>
                <p><small>{trimAndEllipse(narr.description, 120)}</small></p>
              </button>
            </div>
          )
        })}
      </TabPanel>
    );
  }

  renderToolbarTagPanel() {
    if (process.env.features.USE_TAGS &&
      this.props.tags.children) {
      return (
        <TabPanel>
          <TagListPanel
            tags={this.props.tags}
            categories={this.props.categories}
            tagFilters={this.props.tagFilters}
            categoryFilters={this.props.categoryFilters}
            onTagFilter={this.props.methods.onTagFilter}
            onCategoryFilter={this.props.methods.onCategoryFilter}
            language={this.props.language}
          />
        </TabPanel>
      )
    }
    return '';
  }

  renderToolbarTab(_selected, label, icon_key) {
    const isActive = (this.state._selected === _selected);
    let classes = (isActive) ? 'toolbar-tab active' : 'toolbar-tab';

    return (
      <div className={classes} onClick={() => { this.selectTab(_selected); }}>
        <i className="material-icons">{icon_key}</i>
        <div className="tab-caption">{label}</div>
      </div>
    );
  }

  renderToolbarPanels() {
    let classes = (this.state._selected >= 0) ? 'toolbar-panels' : 'toolbar-panels folded';
    return (
      <div className={classes}>
        {this.renderClosePanel()}
        <Tabs selectedIndex={this.state._selected}>
          {this.renderToolbarNarrativePanel()}
          {this.renderToolbarTagPanel()}}
        </Tabs>
      </div>
    )
  }

  renderToolbarNavs() {
    if (this.props.narratives) {
      return this.props.narratives.map((nar, idx) => {
        const isActive = (idx === this.state._selected);

        let classes = (isActive) ? 'toolbar-tab active' : 'toolbar-tab';

        return (
          <div className={classes} onClick={() => { this.selectTab(idx); }}>
            <div className="tab-caption">{nar.label}</div>
          </div>
        );
      })
    }
    return '';
  }

  renderToolbarTabs() {
    const title = copy[this.props.language].toolbar.title;
    const narratives_label = copy[this.props.language].toolbar.narratives_label;
    const tags_label = copy[this.props.language].toolbar.tags_label;
    const isTags = this.props.tags && this.props.tags.children;

    return (
      <div className="toolbar">
        <div className="toolbar-header"><p>{title}</p></div>
        <div className="toolbar-tabs">
          {/*this.renderToolbarTab(0, 'search')*/}
          {this.renderToolbarTab(0, narratives_label, 'timeline')}
          {(isTags) ? this.renderToolbarTab(1, tags_label, 'style') : ''}
        </div>
        <ToolbarBottomActions
          sites={{
            enabled: this.props.sitesShowing,
            toggle: this.props.actions.toggleSites,
          }}
        />
      </div>
    )
  }

  render() {
    const { isNarrative } = this.props

    return (
      <div id="toolbar-wrapper" className={`toolbar-wrapper ${(isNarrative) ? 'narrative-mode' : ''}`}>
        {this.renderToolbarTabs()}
        {this.renderToolbarPanels()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tags: selectors.getTagTree(state),
    categories: selectors.getCategories(state),
    narratives: selectors.selectNarratives(state),
    language: state.app.language,
    tagFilters: selectors.selectTagList(state),
    categoryFilters: selectors.selectCategories(state),
    viewFilters: state.app.filters.views,
    features: state.app.features,
    narrative: state.app.narrative,
    sitesShowing: state.app.flags.isShowingSites
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar)
