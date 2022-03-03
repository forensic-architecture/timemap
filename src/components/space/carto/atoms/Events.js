import React from "react";
import { Portal } from "react-portal";
import colors from "../../../../common/global";
import ColoredMarkers from "../../../atoms/ColoredMarkers";
import hash from "object-hash";
import {
  calcOpacity,
  calculateColorPercentages,
  zipColorsToPercentages,
} from "../../../../common/utilities";

function MapEvents({
  getCategoryColor,
  categories,
  projectPoint,
  styleLocation,
  selected,
  narrative,
  onSelect,
  svg,
  locations,
  eventRadius,
  coloringSet,
  filterColors,
  features,
}) {
  function handleEventSelect(e, location) {
    const events = e.shiftKey
      ? selected.concat(location.events)
      : location.events;
    onSelect(events);
  }

  function renderBorder() {
    return (
      <>
        <circle
          className="event-hover"
          cx="0"
          cy="0"
          r="10"
          stroke={colors.primaryHighlight}
          fillOpacity="0.0"
        />
      </>
    );
  }

  function renderLocationSlicesByAssociation(location) {
    const colorPercentages = calculateColorPercentages([location], coloringSet);

    const styles = {
      stroke: colors.darkBackground,
      strokeWidth: 0,
      fillOpacity: narrative ? 1 : calcOpacity(location.events.length),
    };

    return (
      <ColoredMarkers
        radius={eventRadius}
        colorPercentMap={zipColorsToPercentages(filterColors, colorPercentages)}
        styles={{
          ...styles,
        }}
        className="location-event-marker"
      />
    );
  }

  function renderLocation(location) {
    /**
    {
      events: [...],
      label: 'Location name',
      latitude: '47.7',
      longitude: '32.2'
    }
    */
    if (!location.latitude || !location.longitude) return null;
    const { x, y } = projectPoint([location.latitude, location.longitude]);

    // in narrative mode, only render events in narrative
    // TODO: move this to a selector
    if (narrative) {
      const { steps } = narrative;
      const onlyIfInNarrative = (e) => steps.map((s) => s.id).includes(e.id);
      const eventsInNarrative = location.events.filter(onlyIfInNarrative);

      if (eventsInNarrative.length <= 0) {
        return null;
      }
    }

    const customStyles = styleLocation ? styleLocation(location) : null;
    const extraRender = () => <>{customStyles[1]}</>;

    const isSelected = selected.reduce((acc, event) => {
      return (
        acc ||
        (event.latitude === location.latitude &&
          event.longitude === location.longitude)
      );
    }, false);

    return (
      <svg key={hash(location)}>
        <g
          className={`location-event ${narrative ? "no-hover" : ""}`}
          transform={`translate(${x}, ${y})`}
          onClick={(e) => handleEventSelect(e, location)}
        >
          {renderLocationSlicesByAssociation(location)}
          {extraRender ? extraRender() : null}
          {isSelected ? null : renderBorder()}
        </g>
      </svg>
    );
  }

  return (
    <Portal node={svg}>
      <svg>
        <g className="event-locations">{locations.map(renderLocation)}</g>
      </svg>
    </Portal>
  );
}

export default MapEvents;
