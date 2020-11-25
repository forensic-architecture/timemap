import React from 'react'

const TimelineHandles = ({ dims, onMoveTime }) => {
  const transform = 'scale(1.5,1.5)'
  const size = 45
  return (
    <g className='time-controls-inline'>
      <g
        transform={`translate(${dims.marginLeft - 20}, ${dims.contentHeight - 10})`}
        onClick={() => onMoveTime('backwards')}
      >
        <circle r={size} />
        <path d='M0,-7.847549217020565L6.796176979388489,3.9237746085102825L-6.796176979388489,3.9237746085102825Z' transform={`rotate(270) ${transform}`} />
      </g>
      <g
        transform={`translate(${dims.width - dims.width_controls + 20}, ${dims.contentHeight - 10})`}
        onClick={() => onMoveTime('forward')}
      >
        <circle r={size} />
        <path d='M0,-7.847549217020565L6.796176979388489,3.9237746085102825L-6.796176979388489,3.9237746085102825Z' transform={`rotate(90) ${transform}`} />
      </g>
    </g>
  )
}

export default TimelineHandles
