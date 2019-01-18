import React from 'react';

function MapShapes({ map, shapes, mapTransformX, mapTransformY }) {
  function projectPoint(location) {
    const latLng = new L.LatLng(location[0], location[1]);
    return {
      x: map.latLngToLayerPoint(latLng).x + mapTransformX,
      y: map.latLngToLayerPoint(latLng).y + mapTransformY
    };
  }

  function renderShape(shape) {
    const coords = shape.points.map(projectPoint)
    return coords.map(pt => (
      <div
        className="leaflet-tooltip shape-label leaflet-zoom-animated leaflet-tooltip-top"
        style={{ opacity: 1, transform: `translate3d(calc(${pt.x}px - 50%), ${pt.y - 25}px, 0px)`}}>
        {shape.name}
      </div>
    ));
  }

  if (!shapes || !shapes.length) return null;

  return (
    <div className="shapes-layer">
      {shapes.map(renderShape)}
    </div>
  )

}

export default MapShapes;
