import React from 'react';

const TimelineEvents = ({ events, getEventX, getEventY,
  getCategoryColor, onSelect, transitionDuration }) => {

  function getAllEventsAtOnce(eventPoint) {
    const timestamp = eventPoint.timestamp;
    const category = eventPoint.category;
    return events
      .filter(event => (event.timestamp === timestamp && category === event.category))
  }

  function renderEvent(event) {
    return (
      <circle
        className="event"
        cx={0}
        cy={0}
        style={{
          'transform': `translate(${getEventX(event)}px, ${getEventY(event)}px)`,
          'transition': `transform ${transitionDuration / 1000}s ease`
        }}
        r={5}        
        fill={getCategoryColor(event.category)}
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