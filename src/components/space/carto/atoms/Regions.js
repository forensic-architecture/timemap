import React from "react";
import { Portal } from "react-portal";

function MapRegions({ svg, regions, projectPoint, styles }) {
  function renderRegion(region) {
    const lineCoords = [];
    const points = region.points.map(projectPoint);

    points.forEach((p1, idx) => {
      if (idx < region.points.length - 1) {
        const p2 = points[idx + 1];
        lineCoords.push({
          x1: p1.x,
          y1: p1.y,
          x2: p2.x,
          y2: p2.y,
        });
      }
    });

    return lineCoords.map((coords) => {
      const regionstyles =
        region.name in styles ? styles[region.name] : styles.default;

      return (
        <line
          id={`${region.name}_style`}
          markerStart="none"
          {...coords}
          style={regionstyles}
        />
      );
    });
  }

  if (!regions || !regions.length) return null;

  return (
    <Portal node={svg}>
      <g id="regions-layer" className="narrative">
        {regions.map(renderRegion)}
      </g>
    </Portal>
  );
}

export default MapRegions;
