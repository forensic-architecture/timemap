import React from "react";
import { colors } from "../../common/global";

const SpotlightMarker = ({ x, y, radius, styles }) => {
  return (
    <g className="spotlight-marker" transform={`translate(${x}, ${y})`}>
      <circle
        className="spotlight-interactive"
        stroke-opacity="1"
        stroke={styles ? styles.stroke : colors.yellow}
        stroke-width={styles ? styles.strokeWidth : 2}
        stroke-dasharray={styles ? styles.strokeDasharray : ""}
        stroke-linejoin="round"
        fill="none"
        r={radius}
      />
    </g>
  );
};

export default SpotlightMarker;
