import React from 'react'

function zoomIsActive(duration, extent) {
  if (duration > 1570000 && extent > 1570000) {
    return true;
  }
  return duration === extent
}

const TimelineZoomControls = ({ extent, zoomLevels, dims, onApplyZoom }) => {
  function renderZoom (zoom, idx) {
    const isActive = zoomIsActive(zoom.duration, extent)
    return (
      <text
        className={`zoom-level-button ${isActive ? 'active' : ''}`}
        x='60'
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
  )
}

export default TimelineZoomControls
