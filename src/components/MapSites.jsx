import React from 'react';

class MapSites extends React.Component {

  projectPoint(location) {
    const latLng = new L.LatLng(location[0], location[1]);
    return {
      x: this.props.map.latLngToLayerPoint(latLng).x + this.props.mapTransformX,
      y: this.props.map.latLngToLayerPoint(latLng).y + this.props.mapTransformY
    };
  }

  renderSite(site) {
    const { x, y } = this.projectPoint([site.latitude, site.longitude]);

    return (<div
        className="leaflet-tooltip site-label leaflet-zoom-animated leaflet-tooltip-top"
        style={{ opacity: 1, transform: `translate3d(calc(${x}px - 50%), ${y - 25}px, 0px)`}}>
        {site.site}
      </div>
    );
  }

  render () {
    if (!this.props.sites || !this.props.sites.length) return <div />;

    return (
      <div className="sites-layer">
        {this.props.sites.map(site => { return this.renderSite(site); })}
      </div>
    )
  }

}

export default MapSites;