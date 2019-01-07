import React from 'react';

const TimelineMarkers = ({ getEventX, getEventY, transitionDuration, selected }) => {
  function renderMarker(event) {
    return (
      <circle
        className="timeline-marker"
        cx={0}
        cy={0}
        style={{
          'transform': `translate(${getEventX(event)}px, ${getEventY(event)}px)`,
          '-webkit-transition': `transform ${transitionDuration / 1000}s ease`,
          '-moz-transition': 'none',
          'opacity': 0.9
        }}        
        r="10"
      >
      </circle>
    )
  }

  return (
    <g
      clipPath={"url(#clip)"}
    >
      {selected.map(event => renderMarker(event))}
    </g>
  );
}

export default TimelineMarkers;