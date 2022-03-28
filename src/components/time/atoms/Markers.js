import React from "react";
import colors from "../../../common/global";
import hash from "object-hash";
import {
  getEventCategories,
  isLatitude,
  isLongitude,
} from "../../../common/utilities";
import { AVAILABLE_SHAPES } from "../../../common/constants";

const TimelineMarkers = ({
  styles,
  eventRadius,
  getEventX,
  getEventY,
  categories,
  transitionDuration,
  selected,
  dims,
  features,
}) => {
  function renderMarker(acc, event) {
    function renderCircle(y) {
      return (
        <circle
          key={hash(event)}
          className="timeline-marker"
          cx={0}
          cy={0}
          stroke={styles ? styles.stroke : colors.primaryHighlight}
          strokeOpacity="1"
          strokeWidth={styles ? styles["stroke-width"] : 1}
          strokeLinejoin="round"
          strokeDasharray={styles ? styles["stroke-dasharray"] : "2,2"}
          style={{
            transform: `translate(${getEventX(event)}px, ${y}px)`,
            WebkitTransition: `transform ${transitionDuration / 1000}s ease`,
            MozTransition: "none",
            opacity: 1,
          }}
          r={eventRadius * 2}
        />
      );
    }
    function renderBar() {
      return (
        <rect
          className="timeline-marker"
          x={0}
          y={dims.marginTop}
          width={eventRadius / 1.5}
          height={dims.contentHeight - 55}
          stroke={styles ? styles.stroke : colors.primaryHighlight}
          strokeOpacity="1"
          strokeWidth={styles ? styles["stroke-width"] : 1}
          strokeDasharray={styles ? styles["stroke-dasharray"] : "2,2"}
          style={{
            transform: `translate(${getEventX(event)}px)`,
            opacity: 0.7,
          }}
        />
      );
    }

    const isDot =
      (isLatitude(event.latitude) && isLongitude(event.longitude)) ||
      (features.GRAPH_NONLOCATED && event.projectOffset !== -1);

    const evShadows = getEventCategories(event, categories).map((cat) =>
      getEventY({ ...event, category: cat })
    );

    function renderMarkerForEvent(y) {
      switch (event.shape) {
        case "circle":
        case AVAILABLE_SHAPES.DIAMOND:
        case AVAILABLE_SHAPES.STAR:
          acc.push(renderCircle(y));
          break;
        case AVAILABLE_SHAPES.BAR:
          acc.push(renderBar(y));
          break;
        default:
          return isDot ? acc.push(renderCircle(y)) : acc.push(renderBar(y));
      }
    }

    if (evShadows.length > 0) {
      evShadows.forEach(renderMarkerForEvent);
    } else {
      renderMarkerForEvent(getEventY(event));
    }
    return acc;
  }

  return <g clipPath="url(#clip)">{selected.reduce(renderMarker, [])}</g>;
};

export default TimelineMarkers;
