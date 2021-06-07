import React from "react";
import { colors } from "../../../common/global";
import { getEventCategories } from "../../../common/utilities";
import { ASSOCIATION_TYPES } from "../../../common/constants";

const TimelineSpotlightEvents = ({
  styles,
  getEventX,
  getEventY,
  eventRadius,
  categories,
  transitionDuration,
  selected,
}) => {
  function renderSpotlightEvent(acc, event) {
    function renderMarker(y, spotlightType) {
      const dashSpotlight = spotlightType === ASSOCIATION_TYPES.DASH;
      return (
        <circle
          className="spotlight-marker"
          cx={0}
          cy={0}
          stroke={styles ? styles.stroke : colors.white}
          stroke-opacity="1"
          stroke-width={styles ? styles.strokeWidth : 2}
          stroke-linejoin="round"
          stroke-dasharray={dashSpotlight ? "2,2" : ""}
          style={{
            transform: `translate(${getEventX(event)}px, ${y}px)`,
            "-webkit-transition": `transform ${
              transitionDuration / 1000
            }s ease`,
            "-moz-transition": "none",
            opacity: 1,
          }}
          r={eventRadius * 2}
        />
      );
    }

    const evShadows = getEventCategories(event, categories).map((cat) =>
      getEventY({ ...event, category: cat })
    );

    const { spotlightType } = event;

    if (evShadows.length > 0) {
      evShadows.forEach((y) => acc.push(renderMarker(y, spotlightType)));
    } else {
      acc.push(renderMarker(getEventY(event), spotlightType));
    }
    return acc;
  }

  return (
    <g clipPath="url(#clip)">{selected.reduce(renderSpotlightEvent, [])}</g>
  );
};

export default TimelineSpotlightEvents;
