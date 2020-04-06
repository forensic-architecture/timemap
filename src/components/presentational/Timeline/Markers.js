import React from 'react'
import colors, { sizes } from '../../../common/global'

const TimelineMarkers = ({
  styles,
  getEventX,
  getY,
  transitionDuration,
  selected,
  dims,
  noCategories
}) => {
  function renderMarker (event) {
    const isLocated = !!event.latitude && !!event.longitude
    return isLocated ? (
      <circle
        className='timeline-marker'
        cx={0}
        cy={0}
        stroke={styles ? styles.stroke : colors.primaryHighlight}
        stroke-opacity='1'
        stroke-width={styles ? styles['stroke-width'] : 1}
        stroke-linejoin='round'
        stroke-dasharray={styles ? styles['stroke-dasharray'] : '2,2'}
        style={{
          'transform': `translate(${getEventX(event.timestamp)}px, ${getY(event)}px)`,
          '-webkit-transition': `transform ${transitionDuration / 1000}s ease`,
          '-moz-transition': 'none',
          'opacity': 0.9
        }}
        r={sizes.eventDotR * 2}
      />
    ) : (
      <rect
        className='timeline-marker'
        x={0}
        y={0}
        width={sizes.eventDotR}
        height={dims.contentHeight - 55}
        stroke={styles ? styles.stroke : colors.primaryHighlight}
        stroke-opacity='1'
        stroke-width={styles ? styles['stroke-width'] : 1}
        stroke-dasharray={styles ? styles['stroke-dasharray'] : '2,2'}
        style={{
          'transform': `translate(${getEventX(event.timestamp)}px)`,
          'opacity': 0.9
        }}
      />
    )
  }

  return (
    <g
      clipPath={'url(#clip)'}
    >
      {selected.map(event => renderMarker(event))}
    </g>
  )
}

export default TimelineMarkers
