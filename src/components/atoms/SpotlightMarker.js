import React from "react";
import { colors } from "../../common/global";
import { AVAILABLE_SHAPES } from "../../common/constants";

const SpotlightMarker = ({ x, y, radius, styles, shape }) => {
  function renderSpotlightMarker() {
    switch (shape) {
      case AVAILABLE_SHAPES.DASH:
        return (
          <rect
            className="spotlight-interactive"
            width={radius / 1.5}
            height={radius * 2}
            strokeOpacity="0.75"
            stroke={styles ? styles.stroke : colors.yellow}
            strokeWidth={styles ? styles.strokeWidth : 2}
            strokeDasharray={styles ? styles.strokeDasharray : ""}
            strokeLineJoin="round"
            fill="none"
          />
        );
      default:
        return (
          <circle
            className="spotlight-interactive"
            strokeOpacity="0.75"
            stroke={styles ? styles.stroke : colors.yellow}
            strokeWidth={styles ? styles.strokeWidth : 2}
            strokeDasharray={styles ? styles.strokeDasharray : ""}
            strokeLineJoin="round"
            fill="none"
            r={radius}
          />
        );
    }
  }

  return (
    <g className="spotlight-marker" transform={`translate(${x}, ${y})`}>
      {renderSpotlightMarker()}
    </g>
  );
};

export default SpotlightMarker;
