import React from 'react'

export default ({
  category,
  events,
  x,
  y,
  width,
  height,
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
    width={width}
    height={height}
  />
)
