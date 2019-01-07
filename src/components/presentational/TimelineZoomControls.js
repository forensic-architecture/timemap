import React from 'react';

const TimelineZoomControls = ({ zoomLevels, dims, onApplyZoom }) => {
  
  function renderZoom(zoom, idx) {
    return (
      <text
        className={`zoom-level-button ${zoom.active ? 'active' : ''}`}
        x="60"
        y={(idx * 15) + 20}
        onClick={() => onApplyZoom(zoom)}
      >
        {zoom.label}
      </text>
    )
  }

  return (
    <g transform={`translate(${dims.width - dims.width_controls}, 0)`}>
      {zoomLevels.map((z, idx) => renderZoom(z, idx))}
    </g>
  );
}

export default TimelineZoomControls;