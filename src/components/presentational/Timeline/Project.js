import React from 'react'
import { sizes } from '../../../common/global'

export default ({
  id,
  offset,
  start,
  end,
  getX,
  dims,
  colour,
  onClick
}) => {
  const length = getX(end) - getX(start)
  return <rect
    onClick={onClick}
    className='project'
    x={getX(start)}
    y={dims.trackHeight - offset}
    width={length}
    style={{ fill: colour, fillOpacity: 0.1 }}
    height={2 * sizes.eventDotR}
  />
}
