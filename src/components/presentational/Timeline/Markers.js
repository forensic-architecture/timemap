import React from 'react'
import colors from '../../../common/global.js'

const TimelineMarkers = ({ styles, getEventX, getCategoryY, transitionDuration, selected }) => {
  function renderMarker (event) {
    const isLocated = !!event.latitude && !!event.longitude
    return isLocated ? (
      <circle
        className='timeline-marker'
        cx={0}
        cy={0}
        stroke={styles ? styles.stroke : colors.primaryHighlight}
        stroke-opacity='1'
        stroke-width={styles ? styles['stroke-width'] : 2}
        stroke-linecap=''
        stroke-linejoin='round'
        stroke-dasharray={styles ? styles['stroke-dasharray'] : '2,2'}
        style={{
          'transform': `translate(${getEventX(event)}px, ${getCategoryY(event.category)}px)`,
          '-webkit-transition': `transform ${transitionDuration / 1000}s ease`,
          '-moz-transition': 'none',
          'opacity': 0.9
        }}
        r='10'
      />
    ) : (
      <rect
        className='timeline-marker'
        x={0}
        y={0}
        width={4}
        height={55}
        stroke={styles ? styles.stroke : colors.primaryHighlight}
        stroke-opacity='1'
        stroke-width={styles ? styles['stroke-width'] : 2}
        stroke-linecap=''
        style={{
          'transform': `translate(${getEventX(event)}px, 40px)`,
          '-webkit-transition': `transform ${transitionDuration / 1000}s ease`,
          '-moz-transition': 'none',
          'opacity': 0.9
        }}
        r='10'
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
