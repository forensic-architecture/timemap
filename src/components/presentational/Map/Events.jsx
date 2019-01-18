import React from 'react';
import { Portal } from 'react-portal';

function MapEvents ({ getCategoryColor, categories, projectPoint, styleLocation, narrative, onSelect, svg, locations }){
  function getLocationEventsDistribution(location) {
    const eventCount = {};
    const categories = categories;

    categories.forEach(cat => {
      eventCount[cat.category] = [];
    });

    location.events.forEach((event) => {;
      eventCount[event.category].push(event);
    });

    return eventCount;
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
    const { x, y } = projectPoint([location.latitude, location.longitude]);
    // const eventsByCategory = getLocationEventsDistribution(location);

    const locCategory = location.events.length > 0 ? location.events[0].category : 'default'
    const customStyles = styleLocation ? styleLocation(location) : null
    const extraStyles = customStyles[0]
    const extraRender = customStyles[1]

    const styles = ({
      fill: getCategoryColor(locCategory),
      fillOpacity: 1,
      ...customStyles[0]
    })

    // in narrative mode, only render events in narrative
    if (narrative) {
      const { steps } = narrative
      const onlyIfInNarrative = e => steps.map(s => s.id).includes(e.id)
      const eventsInNarrative = location.events.filter(onlyIfInNarrative)

      if (eventsInNarrative.length <= 0) {
        return null
      }
    }

    return (
      <g
        className="location"
        transform={`translate(${x}, ${y})`}
        onClick={() => onSelect(location.events)}
      >
        <circle
          className="location-event-marker"
          r={7}
          style={styles}
        >
        </circle>
        {extraRender ? extraRender() : null}
      </g>
    )
  }

  return (
    <Portal node={svg}>
      {locations.map(renderLocation)}
    </Portal>
  );
}

export default MapEvents;
