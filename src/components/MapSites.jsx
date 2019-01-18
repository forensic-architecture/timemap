import React from 'react';

function MapSites({ map, sites, mapTransformX, mapTransformY }) {
  function projectPoint(location) {
    const latLng = new L.LatLng(location[0], location[1]);
    return {
      x: map.latLngToLayerPoint(latLng).x + mapTransformX,
      y: map.latLngToLayerPoint(latLng).y + mapTransformY
    };
  }

  function renderSite(site) {
    const { x, y } = projectPoint([site.latitude, site.longitude]);

    return (<div
      className="leaflet-tooltip site-label leaflet-zoom-animated leaflet-tooltip-top"
      style={{ opacity: 1, transform: `translate3d(calc(${x}px - 50%), ${y - 25}px, 0px)`}}>
      {site.site}
    </div>
    );
  }

  if (!sites || !sites.length) return null;

  return (
    <div className="sites-layer">
      {sites.map(renderSite)}
    </div>
  )

}

export default MapSites;
