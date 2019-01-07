import React from 'react';

const TimelineEvents = ({ events, narrative, getEventX, getEventY,
  getCategoryColor, onSelect, transitionDuration }) => {

  function getAllEventsAtOnce(eventPoint) {
    const timestamp = eventPoint.timestamp;
    const category = eventPoint.category;
    return events
      .filter(event => (event.timestamp === timestamp && category === event.category))
  }

  function renderEvent(event) {
    let styleProps = ({
      fill: getCategoryColor(event.category),
      fillOpacity: 0.8,
      transform: `translate(${getEventX(event)}px, ${getEventY(event)}px)`,
      transition: `transform ${transitionDuration / 1000}s ease`
    });

    if (narrative) {
      const { steps } = narrative
      const isInNarrative = steps.map(s => s.id).includes(event.id)

      if (!isInNarrative) {
        styleProps = {
          ...styleProps,
          fillOpacity: 0.1
        }
      }
    }

    return (
      <circle
        className="event"
        cx={0}
        cy={0}
        style={styleProps}
        r={5}        
        onClick={() => {onSelect(getAllEventsAtOnce(event))}}
      >
      </circle>
    )
  }

  return (
    <g
      clipPath={"url(#clip)"}
    >
      {events.map(event => renderEvent(event))}
    </g>
  );
}

export default TimelineEvents;