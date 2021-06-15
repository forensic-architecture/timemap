import React from "react";
import SpotlightMarker from "../../../atoms/SpotlightMarker";
import { styleSpotlight } from "../../../../common/utilities";
import { Portal } from "react-portal";

const SpotlightMapEvents = ({ svg, selected, projectPoint }) => {
  function renderMarker(acc, marker) {
    function renderSpotlight(r, styles) {
      return <SpotlightMarker x={x} y={y} radius={r} styles={styles} />;
    }

    const { latitude, longitude, spotlights, radius } = marker;
    const { x, y } = projectPoint([latitude, longitude]);
    const r = radius ? radius + 5 : 24;
    const step = 0.25;

    spotlights.forEach((sp, idx) => {
      const stepRadius = r + idx * step;
      acc.push(renderSpotlight(stepRadius, styleSpotlight(sp)));
    });

    return acc;
  }

  return <Portal node={svg}>{selected.reduce(renderMarker, [])}</Portal>;
};

export default SpotlightMapEvents;
