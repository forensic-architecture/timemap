import React from 'react';

import SitesIcon from './presentational/Icons/SitesIcon.js';
import RefreshIcon from './presentational/Icons/RefreshIcon.js';
import CoeventIcon from './presentational/Icons/CoeventIcon.js';
import RouteIcon from './presentational/Icons/RouteIcon.js';

class ToolbarBottomActions extends React.Component {
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

  render() {
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
}

export default ToolbarBottomActions;
