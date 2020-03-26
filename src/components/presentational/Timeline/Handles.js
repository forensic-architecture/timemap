import React from 'react'

const TimelineHandles = ({ dims, onMoveTime }) => {
  return (
    <g className='time-controls-inline'>
      <g
        transform={`translate(${dims.marginLeft - 20}, ${dims.contentHeight - 10})`}
        onClick={() => onMoveTime('backwards')}
      >
        <circle r='15' />
        <path d='M0,-7.847549217020565L6.796176979388489,3.9237746085102825L-6.796176979388489,3.9237746085102825Z' transform='rotate(270)' />
      </g>
      <g
        transform={`translate(${dims.width - dims.width_controls + 20}, ${dims.contentHeight - 10})`}
        onClick={() => onMoveTime('forward')}
      >
        <circle r='15' />
        <path d='M0,-7.847549217020565L6.796176979388489,3.9237746085102825L-6.796176979388489,3.9237746085102825Z' transform='rotate(90)' />
      </g>
    </g>
  )
}

export default TimelineHandles
