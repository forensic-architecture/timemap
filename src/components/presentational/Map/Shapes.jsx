import React from 'react'
import { Portal } from 'react-portal'

function MapShapes({ svg, shapes, projectPoint }) {
  function renderShape(shape, lineStyle) {
    const lineCoords = []
    const points = shape.points
      .map(projectPoint)

    points.forEach((p1, idx) => {
      if (idx < shape.points.length - 1) {
        const p2 = points[idx+1]
        lineCoords.push({
          x1: p1.x,
          y1: p1.y,
          x2: p2.x,
          y2: p2.y
        })
      }
    })

    return lineCoords.map(coords => (
      <line
        className={shape.name}
        markerStart="none"
        {...coords}
        style={lineStyle}
      >
      </line>
    ))
  }

  if (!shapes || !shapes.length) return null

  return (
    <Portal node={svg}>
      <g id={`shapes-layer`} className="narrative">
        {shapes.map(s => renderShape(s, {
          strokeWidth: 3,
          stroke: 'blue'
        }))}
      </g>
    </Portal>
  )

}

export default MapShapes
