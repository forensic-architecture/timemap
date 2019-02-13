import React from 'react'

export default ({ viewIdx, paths, onShiftHandler }) => {
  const backArrow = viewIdx !== 0 ? (
    <div
      className='back'
      onClick={() => onShiftHandler(-1)}
    >
      <svg>
        <path d='M0,-7.847549217020565L6.796176979388489,3.9237746085102825L-6.796176979388489,3.9237746085102825Z' />
      </svg>
    </div>
  ) : null
  const forwardArrow = viewIdx < paths.length - 1 ? (
    <div
      className='next'
      onClick={() => onShiftHandler(1)}
    >
      <svg>
        <path d='M0,-7.847549217020565L6.796176979388489,3.9237746085102825L-6.796176979388489,3.9237746085102825Z' />
      </svg>
    </div>
  ) : null

  if (paths.length > 1) {
    return (
      <div className='media-gallery-controls'>
        {backArrow}
        {forwardArrow}
      </div>
    )
  }
  return (
    <div className='media-gallery-controls' />
  )
}
