import React from 'react'
import colors from '../../../common/global'

const TimelineMarkers = ({
  styles,
  eventRadius,
  getEventX,
  getEventY,
  transitionDuration,
  selected,
  dims,
  features
}) => {
  function renderMarker (event) {
    function renderCircle () {
      return <circle
        className='timeline-marker'
        cx={0}
        cy={0}
        stroke={styles ? styles.stroke : colors.primaryHighlight}
        stroke-opacity='1'
        stroke-width={styles ? styles['stroke-width'] : 1}
        stroke-linejoin='round'
        stroke-dasharray={styles ? styles['stroke-dasharray'] : '2,2'}
        style={{
          'transform': `translate(${getEventX(event)}px, ${getEventY(event)}px)`,
          '-webkit-transition': `transform ${transitionDuration / 1000}s ease`,
          '-moz-transition': 'none',
          'opacity': 0.9
        }}
        r={eventRadius * 2}
      />
    }
    function renderBar () {
      return <rect
        className='timeline-marker'
        x={0}
        y={0}
        width={eventRadius / 2}
        height={dims.contentHeight - 55}
        stroke={styles ? styles.stroke : colors.primaryHighlight}
        stroke-opacity='1'
        stroke-width={styles ? styles['stroke-width'] : 1}
        stroke-dasharray={styles ? styles['stroke-dasharray'] : '2,2'}
        style={{
          'transform': `translate(${getEventX(event)}px)`,
          'opacity': 0.7
        }}
      />
    }
    const isDot = (!!event.location && !!event.longitude) || (features.GRAPH_NONLOCATED && event.projectOffset !== -1)

    switch (event.shape) {
      case 'circle':
        return renderCircle()
      case 'bar':
        return renderBar()
      case 'diamond':
        return renderCircle()
      case 'star':
        return renderCircle()
      default:
        return isDot ? renderCircle() : renderBar()
    }
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
