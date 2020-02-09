import React from 'react'

function zoomIsActive (duration, extent, max) {
  if (duration >= max && extent >= max) {
    return true
  }
  return duration === extent
}

const TimelineZoomControls = ({ extent, zoomLevels, dims, onApplyZoom }) => {
  function renderZoom (zoom, idx) {
    const max = zoomLevels.reduce((acc, vl) => acc.duration < vl.duration ? vl : acc)
    const isActive = zoomIsActive(zoom.duration, extent, max.duration)
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
