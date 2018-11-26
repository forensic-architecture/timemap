import '../scss/main.scss';
import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Search from './Search.jsx';
import TagListPanel from './TagListPanel.jsx';
import Icon from './Icon.jsx';
import copy from '../js/data/copy.json';
// NB: i think this entire component can actually be part of a future feature...

class Toolbar extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        tab: -1
      };
    }

    toggleTab(tabIndex) {
      if ( this.state.tab === tabIndex ) {
       this.setState({ tab: -1 });
      } else {
        this.setState({ tab: tabIndex });
      }
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
      const isLayerInView = !this.props.viewFilters[layer];
      const newViews = {};
      newViews[layer] = isLayerInView;
      const views = Object.assign({}, this.props.viewFilters, newViews);
      this.props.actions.updateFilters({ views });
    }

    renderMapActions() {
      const isViewLayer = this.props.viewFilters;
      const routeClass = (isViewLayer.routes) ? 'action-button active disabled' : 'action-button disabled'
      const sitesClass = (isViewLayer.sites) ? 'action-button active disabled' : 'action-button disabled';
      const coeventsClass = (isViewLayer.coevents) ? 'action-button active disabled' : 'action-button disabled';

      return (
        <div className="bottom-action-block">
          <button
            className={routeClass}
            onClick={() => this.toggleMapViews('routes')}
          >
              <svg x="0px" y="0px" width="30px" height="20px" viewBox="0 0 30 20" enableBackground="new 0 0 30 20">
                  <path d="M0.806,13.646h7.619c2.762,0,3-0.238,3-3v-0.414c0-2.762,0.301-3,3.246-3h14.523"/>
                  <polyline points="16.671,9.228 19.103,7.233 16.671,5.237 "/>
              </svg>
          </button>
          <button
            className={sitesClass}
            onClick={() => this.toggleMapViews('sites')}
          >
            <svg x="0px" y="0px" width="30px" height="20px" viewBox="0 0 30 20" enableBackground="new 0 0 30 20">
              <path d="M24.615,6.793H5.385c-2.761,0-3,0.239-3,3v0.414
              c0,2.762,0.239,3,3,3h7.621l1.996,2.432l1.996-2.432h7.618c2.762,0,3-0.238,3-3V9.793C27.615,7.032,27.377,6.793,24.615,6.793z"/>
            </svg>
          </button>
          <button
              className={coeventsClass}
              onClick={() => this.toggleMapViews('coevents')}
          >
            <svg className="coevents" x="0px" y="0px" width="30px" height="20px" viewBox="0 0 30 20" enableBackground="new 0 0 30 20">
              <polygon stroke-linejoin="round" stroke-miterlimit="10" points="19.178,20 10.823,20 10.473,14.081
                10,13.396 10,6.084 20,6.084 20,13.396 19.445,14.021 "/>
              <rect className="no-fill" x="11.4" y="7.867" width="7.2" height="3.35"/>
              <line stroke-linejoin="round" stroke-miterlimit="10" x1="12.125" y1="1" x2="12.125" y2="5.35"/>
              <rect x="11.4" y="4.271" width="1.496" height="1.079"/>
              <rect x="17.104" y="4.271" width="1.496" height="1.079"/>
            </svg>
          </button>
        </div>
      );
      return (<div/>)
    }

    renderBottomActions() {
      return (
        <div className="bottom-actions">
          {this.renderMapActions()}
          <div className="bottom-action-block">
            <button className="action-button tiny default" onClick={() => { /*this.toggleLanguage()*/}}>
              {(this.props.language === 'es-MX') ? 'ES' : 'EN' }
            </button>
            <button className="action-button info tiny default" onClick={() => {/*this.toggleInfoPopup()*/}}>
              i
            </button>
            <button className="action-button tiny" onClick={() => this.resetAllFilters()}>
              <svg className="reset" x="0px" y="0px" width="25px" height="25px" viewBox="7.5 7.5 25 25" enableBackground="new 7.5 7.5 25 25">
                <path stroke-width="2" stroke-miterlimit="10" d="M28.822,16.386c1.354,3.219,0.898,7.064-1.5,9.924
                c-3.419,4.073-9.49,4.604-13.562,1.186c-4.073-3.417-4.604-9.49-1.187-13.562c1.987-2.368,4.874-3.54,7.74-3.433" />
                <polygon points="26.137,12.748 27.621,19.464 28.9,16.741 31.898,16.503" />
              </svg>
            </button>
          </div>
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
    //let caption_lang = copy[this.props.language].toolbar.tabs[tabNum];
    let classes = (isActive) ? 'toolbar-tab active' : 'toolbar-tab';
    return (
      <div className={classes} onClick={() => { this.toggleTab(tabNum); }}>
        {/*<Icon iconType={key} />*/}
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

  renderToolbarTabs() {
    const title = copy[this.props.language].toolbar.title;
    return (
      <div className="toolbar">
        <div className="toolbar-header"><p>{title}</p></div>
        <div className="toolbar-tabs">
          {/*this.renderToolbarTab(0, 'search')*/}
          {this.renderToolbarTagRoot()}
        </div>
        {/* {this.renderBottomActions()} */}
      </div>
    )
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
          filter={this.props.filter}
          title={title}
          overview={overview}
          language={this.props.language}
          tagType={tagType}
        />
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

  render() {
    let classes = (this.state.tab !== -1) ? 'toolbar-panels' : 'toolbar-panels folded';

    return (
      <div id="toolbar-wrapper" className="toolbar-wrapper">
        {this.renderToolbarTabs()}
        <div className={classes}>
          {this.renderPanelHeader()}
          <Tabs selectedIndex={this.state.tab}>
            {this.renderToolbarTagList()}
          </Tabs>
        </div>
      </div>
    );
  }
}

export default Toolbar;
