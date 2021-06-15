import React from "react";
import { colors } from "../../common/global";

const SpotlightMarker = ({ x, y, radius, styles }) => {
  return (
    <g className="spotlight-marker" transform={`translate(${x}, ${y})`}>
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
    </g>
  );
};

export default SpotlightMarker;
