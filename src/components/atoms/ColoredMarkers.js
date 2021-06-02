import React from "react";
import { getCoordinatesForPercent } from "../../common/utilities";

function ColoredMarkers({ radius, colorPercentMap, styles, className }) {
  let cumulativeAngleSweep = 0;
  return (
    <>
      {colorPercentMap.map((colorSet, idx) => {
        const [color, colorPercent] = Object.entries(colorSet)[0];

        const [startX, startY] = getCoordinatesForPercent(
          radius,
          cumulativeAngleSweep
        );

        cumulativeAngleSweep += colorPercent;

        const [endX, endY] = getCoordinatesForPercent(
          radius,
          cumulativeAngleSweep
        );
        // if the slices are less than 2, take the long arc
        const largeArcFlag =
          colorPercentMap.length === 1 || colorPercent > 0.5 ? 1 : 0;

        // create an array and join it just for code readability
        const arc = [
          `M ${startX} ${startY}`, // Move
          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
          "L 0 0 ", // Line
          `L ${startX} ${startY} Z`, // Line
        ].join(" ");

        const extraStyles = {
          ...styles,
          fill: color,
        };

        return (
          <path
            className={className}
            id={`arc_${idx}`}
            d={arc}
            style={extraStyles}
          />
        );
      })}
    </>
  );
}

export default ColoredMarkers;
