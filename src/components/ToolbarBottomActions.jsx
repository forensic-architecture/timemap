import React from 'react';

import SitesIcon from './presentational/Icons/SitesIcon.js';
import RefreshIcon from './presentational/Icons/RefreshIcon.js';
import CoeventIcon from './presentational/Icons/CoeventIcon.js';
import RouteIcon from './presentational/Icons/RouteIcon.js';

function ToolbarBottomActions (props) {
  function renderMapActions() {
    return (
      <div className="bottom-action-block">
          {/* <RouteIcon */}
          {/*   onClick={(view) => this.toggleMapViews(view)} */}
          {/*   isEnabled={this.props.viewFilters.routes} */}
          {/* /> */}
          <SitesIcon
            isEnabled={props.sites.enabled}
            onClickHandler={props.sites.toggle}
          />
          {/* <CoeventIcon */}
          {/*   onClick={(view) => this.toggleMapViews(view)} */}
          {/*   isEnabled={this.props.viewFilters.coevents} */}
          {/* /> */}
      </div>
    );
  }

  return (
    <div className="bottom-actions">
      {renderMapActions()}
      <div className="bottom-action-block">
        {/* <button className="action-button tiny default" onClick={() => { toggleLanguage()}}> */}
        {/*   {(props.language === 'es-MX') ? 'ES' : 'EN' } */}
        {/* </button> */}
        {/* <button className="action-button info tiny default" onClick={() => { this.toggleInfoPopup()}}> */}
        {/*   i */}
        {/* </button> */}
        {/* <button className="action-button tiny" onClick={() => this.resetAllFilters()}> */}
        {/*   <RefreshIcon /> */}
        {/* </button> */}
      </div>
    </div>
  )
}

export default ToolbarBottomActions;
