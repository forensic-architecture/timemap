import React from 'react'

export default ({
  category,
  events,
  x,
  y,
  r,
  onSelect,
  styleProps,
  extraRender
}) => (

  <rect
    onClick={onSelect}
    className='event'
    x={x}
    y={y - 0.5 * r}
    style={styleProps}
    width={r}
    height={r}
  />
)
