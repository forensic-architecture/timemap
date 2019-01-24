import React from 'react'

import SitesIcon from './presentational/Icons/Sites.js'
// import RefreshIcon from './presentational/Icons/RefreshIcon.js'
// import CoeventIcon from './presentational/Icons/CoeventIcon.js'
// import RouteIcon from './presentational/Icons/RouteIcon.js'

function ToolbarBottomActions (props) {
  function renderMapActions () {
    return (
      <div className='bottom-action-block'>
        {process.env.features.USE_SITES ? <SitesIcon
          isActive={props.sites.enabled}
          onClickHandler={props.sites.toggle}
        /> : null}
      </div>
    )
  }

  return (
    <div className='bottom-actions'>
      {renderMapActions()}
      <div className='bottom-action-block'>
        {/* <button className='action-button tiny default' onClick={() => { toggleLanguage()}}> */}
        {/*   {(props.language === 'es-MX') ? 'ES' : 'EN' } */}
        {/* </button> */}
        {/* <button className='action-button info tiny default' onClick={() => { this.toggleInfoPopup()}}> */}
        {/*   i */}
        {/* </button> */}
        {/* <button className='action-button tiny' onClick={() => this.resetAllFilters()}> */}
        {/*   <RefreshIcon /> */}
        {/* </button> */}
      </div>
    </div>
  )
}

export default ToolbarBottomActions
