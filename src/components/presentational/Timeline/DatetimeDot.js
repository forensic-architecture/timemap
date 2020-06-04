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
}) => {
  if (!y) return null
  return (
    <circle
      onClick={onSelect}
      className='event'
      cx={x}
      cy={y}
      style={styleProps}
      r={r}
    />
  )
}
