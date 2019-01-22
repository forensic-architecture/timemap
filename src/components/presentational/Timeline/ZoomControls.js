import React from 'react'

const TimelineZoomControls = ({ extent, zoomLevels, dims, onApplyZoom }) => {
  function renderZoom (zoom, idx) {
    const isActive = (zoom.duration === extent)
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
