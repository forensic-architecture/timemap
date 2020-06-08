import React from 'react'
import DatetimeDot from './DatetimeDot'
import DatetimeBar from './DatetimeBar'
import DatetimeSquare from './DatetimeSquare'
import DatetimeStar from './DatetimeStar'
import Project from './Project'
import { calcOpacity } from '../../../common/utilities'

function renderDot (event, styles, props) {
  return <DatetimeDot
    onSelect={props.onSelect}
    category={event.category}
    events={[event]}
    x={props.x}
    y={props.y}
    r={props.eventRadius}
    styleProps={styles}
  />
}

function renderBar (event, styles, props) {
  const fillOpacity = props.features.GRAPH_NONLOCATED
    ? event.projectOffset >= 0 ? styles.opacity : 0.5
    : calcOpacity(1)

  return <DatetimeBar
    onSelect={props.onSelect}
    category={event.category}
    events={[event]}
    x={props.x}
    y={props.dims.marginTop}
    width={props.eventRadius / 4}
    height={props.dims.trackHeight}
    styleProps={{ ...styles, fillOpacity }}
    highlights={props.highlights}
  />
}

function renderDiamond (event, styles, props) {
  return <DatetimeSquare
    onSelect={props.onSelect}
    x={props.x}
    y={props.y}
    r={1.8 * props.eventRadius}
    styleProps={styles}
  />
}

function renderStar (event, styles, props) {
  return <DatetimeStar
    onSelect={props.onSelect}
    x={props.x}
    y={props.y}
    r={1.8 * props.eventRadius}
    styleProps={{ ...styles, fillRule: 'nonzero' }}
    transform='rotate(90)'
  />
}

const TimelineEvents = ({
  events,
  projects,
  narrative,
  getDatetimeX,
  getY,
  getCategoryColor,
  getHighlights,
  onSelect,
  transitionDuration,
  dims,
  features,
  setLoading,
  setNotLoading,
  eventRadius
}) => {
  const narIds = narrative ? narrative.steps.map(s => s.id) : []

  function renderEvent (event) {
    if (narrative) {
      if (!(narIds.includes(event.id))) {
        return null
      }
    }

    const isDot = (!!event.location && !!event.longitude) || (features.GRAPH_NONLOCATED && event.projectOffset !== -1)
    let renderShape = isDot ? renderDot : renderBar
    if (event.shape) {
      if (event.shape === 'bar') {
        renderShape = renderBar
      } else if (event.shape === 'diamond') {
        renderShape = renderDiamond
      } else if (event.shape === 'star') {
        renderShape = renderStar
      } else {
        renderShape = renderDot
      }
    }

    const eventY = getY(event)
    let colour = event.colour ? event.colour : getCategoryColor(event.category)
    const styles = {
      fill: colour,
      fillOpacity: eventY > 0 ? calcOpacity(1) : 0,
      transition: `transform ${transitionDuration / 1000}s ease`
    }

    return renderShape(event, styles, {
      x: getDatetimeX(event.datetime),
      y: eventY,
      eventRadius,
      onSelect: () => onSelect(event),
      dims,
      highlights: features.HIGHLIGHT_GROUPS ? getHighlights(event.filters[features.HIGHLIGHT_GROUPS.filterIndexIndicatingGroup]) : [],
      features
    })
  }

  let renderProjects = () => null
  if (features.GRAPH_NONLOCATED) {
    renderProjects = function () {
      return <React.Fragment>
        {Object.values(projects).map(project => <Project
          {...project}
          eventRadius={eventRadius}
          onClick={() => console.log(project)}
          getX={getDatetimeX}
          dims={dims}
          colour={getCategoryColor(project.category)}
        />)}
      </React.Fragment>
    }
  }

  return (
    <g
      clipPath={'url(#clip)'}
    >
      {renderProjects()}
      {events.map(event => renderEvent(event))}
    </g>
  )
}

export default TimelineEvents
