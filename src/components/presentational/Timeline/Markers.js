import React from 'react'
import colors from '../../../common/global'
import { getEventCategories, isLatitude, isLongitude } from '../../../common/utilities'

const TimelineMarkers = ({
  styles,
  eventRadius,
  getEventX,
  getEventY,
  categories,
  transitionDuration,
  selected,
  dims,
  features
}) => {
  function renderMarker (acc, event) {
    function renderCircle (y) {
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
          'transform': `translate(${getEventX(event)}px, ${y}px)`,
          '-webkit-transition': `transform ${transitionDuration / 1000}s ease`,
          '-moz-transition': 'none',
          'opacity': 1
        }}
        r={eventRadius * 2}
      />
    }
    function renderBar () {
      return <rect
        className='timeline-marker'
        x={0}
        y={dims.marginTop}
        width={eventRadius / 1.5}
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

    const isDot = (isLatitude(event.latitude) && isLongitude(event.longitude)) || (features.GRAPH_NONLOCATED && event.projectOffset !== -1)
    const evShadows = getEventCategories(event, categories).map(cat => getEventY({ ...event, category: cat.id }))

    function renderMarkerForEvent (y) {
      switch (event.shape) {
        case 'circle':
        case 'diamond':
        case 'star':
          acc.push(renderCircle(y))
          break
        case 'bar':
          acc.push(renderBar(y))
          break
        default:
          return isDot ? acc.push(renderCircle(y)) : acc.push(renderBar(y))
      }
    }

    if (evShadows.length > 0) {
      evShadows.forEach(renderMarkerForEvent)
    } else {
      renderMarkerForEvent(getEventY(event))
    }
    return acc
  }

  return (
    <g
      clipPath={'url(#clip)'}
    >
      {selected.reduce(renderMarker, [])}
    </g>
  )
}

export default TimelineMarkers
