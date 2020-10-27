import React from 'react'
import { getCoordinatesForPercent } from '../../../common/utilities'

function ColoredMarkers ({ radius, colorPercentMap, styles, className }) {
  let cumulativeAngleSweep = 0
  const colors = Object.keys(colorPercentMap)

  return (
    <React.Fragment>
      {colors.map((color, idx) => {
        const colorPercent = colorPercentMap[color]

        const [startX, startY] = getCoordinatesForPercent(radius, cumulativeAngleSweep)

        cumulativeAngleSweep += colorPercent

        const [endX, endY] = getCoordinatesForPercent(radius, cumulativeAngleSweep)
        // if the slices are less than 2, take the long arc
        const largeArcFlag = (colors.length === 1) || colorPercent > 0.5 ? 1 : 0

        // create an array and join it just for code readability
        const arc = [
          `M ${startX} ${startY}`, // Move
          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
          `L 0 0 `, // Line
          `L ${startX} ${startY} Z` // Line
        ].join(' ')

        const extraStyles = ({
          ...styles,
          fill: color
        })

        return (
          <path
            class={className}
            id={`arc_${idx}`}
            d={arc}
            style={extraStyles}
          />
        )
      })}
    </React.Fragment>
  )
}

export default ColoredMarkers
