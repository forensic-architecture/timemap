import React from 'react'

export default ({
  offset,
  id,
  start,
  end,
  getX,
  y,
  dims,
  colour,
  eventRadius,
  onClick
}) => {
  const length = getX(end) - getX(start)
  if (offset === undefined) return null
  return <rect
    onClick={onClick}
    className='project'
    x={getX(start)}
    y={dims.marginTop + offset}
    width={length}
    style={{ fill: colour, fillOpacity: 0.2 }}
    height={2 * eventRadius}
  />
}
