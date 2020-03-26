import React from 'react'
import colors, { sizes } from '../../../common/global'

const MARKER_DISPLACED = sizes.eventDotR * 2
const TimelineMarkers = ({
  styles,
  getEventX,
  getCategoryY,
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
          'transform': `translate(${getEventX(event)}px, ${getCategoryY(event.category)}px)`,
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
        y={-dims.marginTop - (noCategories > 2 ? noCategories * MARKER_DISPLACED : MARKER_DISPLACED)}
        width={(2 * sizes.eventDotR) * 0.9}
        height={dims.trackHeight}
        stroke={styles ? styles.stroke : colors.primaryHighlight}
        stroke-opacity='1'
        stroke-width={styles ? styles['stroke-width'] : 1}
        stroke-dasharray={styles ? styles['stroke-dasharray'] : '2,2'}
        style={{
          'transform': `translate(${getEventX(event)}px, 40px)`,
          '-webkit-transition': `transform ${transitionDuration / 1000}s ease`,
          '-moz-transition': 'none',
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
