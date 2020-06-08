import React from 'react'

const DEFAULT_ZOOM_LEVELS = [
  { label: '20 years', duration: 10512000 },
  { label: '2 years', duration: 1051200 },
  { label: '3 months', duration: 129600 },
  { label: '3 days', duration: 4320 },
  { label: '12 hours', duration: 720 },
  { label: '1 hour', duration: 60 }
]

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

  if (zoomLevels.length === 0) {
    zoomLevels = DEFAULT_ZOOM_LEVELS
  }
  return (
    <g transform={`translate(${dims.width - dims.width_controls}, 0)`}>
      {zoomLevels.map((z, idx) => renderZoom(z, idx))}
    </g>
  )
}

export default TimelineZoomControls
