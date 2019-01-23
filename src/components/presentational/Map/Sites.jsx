import React from 'react'

function MapSites ({ sites, projectPoint }) {
  function renderSite (site) {
    const { x, y } = projectPoint([site.latitude, site.longitude])

    return (<div
      className='leaflet-tooltip site-label leaflet-zoom-animated leaflet-tooltip-top'
      style={{ opacity: 1, transform: `translate3d(calc(${x}px - 50%), ${y - 25}px, 0px)` }}>
      {site.site}
    </div>
    )
  }

  if (!sites || !sites.length) return null

  return (
    <div className='sites-layer'>
      {sites.map(renderSite)}
    </div>
  )
}

export default MapSites
