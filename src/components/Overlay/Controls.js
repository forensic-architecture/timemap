import React from 'react'

export default ({ viewIdx, paths, onShiftHandler }) => {
  const backArrow = viewIdx !== 0 ? (
    <div
      className='back'
      onClick={() => onShiftHandler(-1)}
    >
      <div className='centerer'>
        <i className='material-icons'>arrow_left</i>
      </div>
    </div>
  ) : null
  const forwardArrow = viewIdx < paths.length - 1 ? (
    <div
      className='next'
      onClick={() => onShiftHandler(1)}
    >
      <div className='centerer'>
        <i className='material-icons'>arrow_right</i>
      </div>
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
