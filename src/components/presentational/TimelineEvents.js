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
  function renderDatetime(datetime) {
    const customStyles = styleDatetime ? styleDatetime(datetime) : null
    const extraStyles = customStyles[0]
    const extraRender = customStyles[1]

    const styleProps = ({
      fill: getCategoryColor(datetime.events[0].category),
      fillOpacity: 1,
      transition: `transform ${transitionDuration / 1000}s ease`,
      ...extraStyles
    });

    if (narrative) {
      const { steps } = narrative
      const isInNarrative = steps.map(s => s.id).includes(event.id)

      if (!isInNarrative) {
        return null
      }
    }

    return (
      <g
        className='datetime'
        transform={`translate(${getDatetimeX(datetime)}, ${getDatetimeY(datetime)})`}
      >
        <circle
          className="event"
          cx={0}
          cy={0}
          style={styleProps}
          r={5}
          onClick={() => onSelect(datetime.events)}
        >
        </circle>
        { extraRender ? extraRender() : null }
      </g>
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
