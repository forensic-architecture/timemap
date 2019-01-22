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
  <g
    className='datetime'
    transform={`translate(${x}, ${y})`}
    onClick={() => onSelect(events)}
  >
    <circle
      className='event'
      cx={0}
      cy={0}
      style={styleProps}
      r={5}
    />
    { extraRender ? extraRender() : null }
  </g>
)
