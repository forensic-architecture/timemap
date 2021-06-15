import React from "react";
import { colors } from "../../../common/global";
import SpotlightGradient from "../../atoms/SpotlightGradient";
import { getEventCategories } from "../../../common/utilities";
import { ASSOCIATION_TYPES } from "../../../common/constants";

const TimelineSpotlightEvents = ({
  styles,
  getEventX,
  getEventY,
  eventRadius,
  categories,
  transitionDuration,
  events,
}) => {
  function renderSpotlightEvent(acc, event) {
    function renderMarker(y) {
      const { styles } = event;
      return (
        <g
          className="spotlight-marker"
          transform={`translate(${getEventX(event)}, ${y})`}
        >
          <path
            className="spotlight-interactive"
            stroke="url(#spotlight-gradient)"
            stroke-opacity="1"
            stroke-width={styles ? styles.strokeWidth : 2}
            stroke-linecap=""
            stroke-linejoin="round"
            stroke-dasharray={styles ? styles.strokeDasharray : "2"}
            fill="none"
            d={`M0,0a${eventRadius},${eventRadius} 0 1,0 ${
              eventRadius * 2
            },0 a${eventRadius},${eventRadius} 0 1,0 -${eventRadius * 2},0 `}
          />
        </g>
      );
    }

    const evShadows = getEventCategories(event, categories).map((cat) =>
      getEventY({ ...event, category: cat })
    );

    if (evShadows.length > 0) {
      evShadows.forEach((y) => acc.push(renderMarker(y)));
    } else {
      acc.push(renderMarker(getEventY(event)));
    }
    return acc;
  }

  return (
    <g clipPath="url(#clip)">
      <SpotlightGradient />
      {events.reduce(renderSpotlightEvent, [])}
    </g>
  );
};

export default TimelineSpotlightEvents;
