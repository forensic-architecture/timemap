import React from 'react'

export default ({
  category,
  events,
  x,
  y,
  onSelect,
  styleProps,
  extraRender
}) => (
  <circle
    onClick={onSelect}
    className='event'
    cx={x}
    cy={y}
    style={styleProps}
    r={5}
  />
)
