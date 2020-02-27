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
  <rect
    onClick={onSelect}
    className='event'
    x={x}
    y={y}
    style={styleProps}
    width={4}
    height={55}
  />
)
