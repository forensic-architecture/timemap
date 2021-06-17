import React from "react";
import { getEventCategories, styleSpotlight } from "../../../common/utilities";
import SpotlightMarker from "../../atoms/SpotlightMarker";

const TimelineSpotlightEvents = ({
  getEventX,
  getEventY,
  eventRadius,
  categories,
  selectedEvents,
}) => {
  function renderSpotlightEvent(acc, event) {
    function renderMarker(y, styles) {
      const radius = event.shape ? eventRadius + 5 : eventRadius;

      return (
        <SpotlightMarker
          x={getEventX(event)}
          y={y}
          radius={radius}
          styles={styles}
        />
      );
    }

    const evShadows = getEventCategories(event, categories).map((cat) =>
      getEventY({ ...event, category: cat })
    );

    const styles = styleSpotlight(event.spotlight);

    if (evShadows.length > 0) {
      evShadows.forEach((y) => acc.push(renderMarker(y, styles)));
    } else {
      acc.push(renderMarker(getEventY(event), styles));
    }
    return acc;
  }

  return (
    <g clipPath="url(#clip)">
      {selectedEvents.reduce(renderSpotlightEvent, [])}
    </g>
  );
};

export default TimelineSpotlightEvents;
