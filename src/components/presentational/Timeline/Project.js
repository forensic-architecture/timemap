import React from 'react'
import { sizes } from '../../../common/global'

export default ({
  id,
  offset,
  start,
  end,
  getX,
  dims,
  colour
}) => {
  const length = getX(end) - getX(start)
  return <rect
    onClick={() => alert('TODO: associate all events')}
    className='project'
    x={getX(start)}
    y={dims.trackHeight - offset}
    width={length}
    style={{ fill: colour, fillOpacity: 0.1 }}
    height={2 * sizes.eventDotR}
  />
}
