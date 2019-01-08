import React from 'react';

const TimelineEvents = ({
  datetimes,
  narrative,
  getDatetimeX,
  getDatetimeY,
  getCategoryColor,
  onSelect,
  transitionDuration,
  styleDatetime
}) => {
  function getAllEventsAtOnce(eventPoint) {
    const datetime = eventPoint.datetime;
    const category = eventPoint.category;
    return events
      .filter(event => (event.datetime === datetime && category === event.category))
  }

  function renderDatetime(datetime) {
    const customStyles = styleDatetime ? styleDatetime(datetime) : null
    const styleProps = ({
      fill: getCategoryColor(datetime.events[0].category),
      fillOpacity: 1,
      transform: `translate(${getDatetimeX(datetime)}px, ${getDatetimeY(datetime)}px)`,
      transition: `transform ${transitionDuration / 1000}s ease`,
      ...customStyles
    });

    if (narrative) {
      const { steps } = narrative
      const isInNarrative = steps.map(s => s.id).includes(event.id)

      if (!isInNarrative) {
        return null
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
      {datetimes.map(datetime => renderDatetime(datetime))}
    </g>
  );
}

export default TimelineEvents;
