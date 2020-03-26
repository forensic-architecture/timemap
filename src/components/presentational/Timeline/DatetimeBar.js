import React from 'react'

const actual = ({
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

export default () => null
