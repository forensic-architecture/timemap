import React from 'react'

export default ({
  category,
  events,
  x,
  y,
  styleProps,
  extraRender
}) => (
  <g
    className='datetime'
    transform={`translate(${x}, ${y})`}
    onClick={() => onSelect(events)}
  >
    <circle
      className="event"
      cx={0}
      cy={0}
      style={styleProps}
      r={5}
    >
    </circle>
    { extraRender ? extraRender() : null }
  </g>
)

