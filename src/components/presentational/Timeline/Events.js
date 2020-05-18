import React from 'react'
import DatetimeDot from './DatetimeDot'
import DatetimeBar from './DatetimeBar'
import DatetimeSquare from './DatetimeSquare'
import DatetimeStar from './DatetimeStar'
import Project from './Project'
import { calcOpacity } from '../../../common/utilities'
import { sizes } from '../../../common/global'

const GRAPH_NONLOCATED = 'GRAPH_NONLOCATED' in process.env.features && process.env.features.GRAPH_NONLOCATED

function renderDot (event, styles, props) {
  return <DatetimeDot
    onSelect={props.onSelect}
    category={event.category}
    events={[event]}
    x={props.x}
    y={props.y}
    r={sizes.eventDotR}
    styleProps={styles}
  />
}

function renderBar (event, styles, props) {
  const fillOpacity = GRAPH_NONLOCATED
    ? event.projectOffset >= 0 ? styles.opacity : 0.05
    : 0.6

  return <DatetimeBar
    onSelect={props.onSelect}
    category={event.category}
    events={[event]}
    x={props.x}
    y={props.dims.marginTop}
    width={sizes.eventDotR / 4}
    height={props.dims.trackHeight}
    styleProps={{ ...styles, fillOpacity }}
  />
}

function renderDiamond (event, styles, props) {
  return <DatetimeSquare
    onSelect={props.onSelect}
    x={props.x}
    y={props.y}
    r={1.8 * sizes.eventDotR}
    styleProps={styles}
  />
}

function renderStar (event, styles, props) {
  return <DatetimeStar
    onSelect={props.onSelect}
    x={props.x}
    y={props.y}
    r={1.8 * sizes.eventDotR}
    styleProps={{ ...styles, fillRule: 'nonzero' }}
    transform='rotate(90)'
  />
}

const TimelineEvents = ({
  events,
  projects,
  narrative,
  getDatetimeX,
  getCategoryY,
  getCategoryColor,
  onSelect,
  transitionDuration,
  // styleDatetime,
  dims
}) => {
  const narIds = narrative ? narrative.steps.map(s => s.id) : []

  function renderEvent (event) {
    if (narrative) {
      if (!(narIds.includes(event.id))) {
        return null
      }
    }

    let renderShape = renderDot
    if (event.shape) {
      if (event.shape === 'bar') {
        renderShape = renderBar
      } else if (event.shape === 'diamond') {
        renderShape = renderDiamond
      } else if (event.shape === 'star') {
        renderShape = renderStar
      }
    }

    const colour = event.colour ? event.colour : getCategoryColor(event.category)
    const styles = {
      fill: colour,
      fillOpacity: calcOpacity(1),
      transition: `transform ${transitionDuration / 1000}s ease`
    }
    return renderShape(event, styles, {
      x: getDatetimeX(event.timestamp),
      y: (GRAPH_NONLOCATED && !event.latitude && !event.longitude)
        ? event.projectOffset >= 0 ? dims.trackHeight - event.projectOffset : dims.marginTop
        : getCategoryY(event.category),
      onSelect: () => onSelect([event]),
      dims
    })
  }

  /* set `renderProjects` */
  let renderProjects = () => null
  if (GRAPH_NONLOCATED) {
    renderProjects = function () {
      return <React.Fragment>
        {projects.map(project => <Project
          {...project}
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
