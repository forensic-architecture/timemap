import React from 'react'
import DatetimeBar from './DatetimeBar'
import DatetimeSquare from './DatetimeSquare'
import DatetimeStar from './DatetimeStar'
import Project from './Project'
import ColoredMarkers from '../Map/ColoredMarkers.jsx'
import {
  calcOpacity,
  getEventCategories,
  zipColorsToPercentages,
  calculateColorPercentages,
  isLatitude,
  isLongitude } from '../../../common/utilities'

function renderDot (event, styles, props) {
  const colorPercentages = calculateColorPercentages([event], props.coloringSet)
  return (
    <g
      className={'timeline-event'}
      onClick={props.onSelect}
      transform={`translate(${props.x}, ${props.y})`}
    >
      <ColoredMarkers
        radius={props.eventRadius}
        colorPercentMap={zipColorsToPercentages(props.filterColors, colorPercentages)}
        styles={{
          ...styles
        }}
        className={'event'}
      />
    </g>
  )
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
  categories,
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
  eventRadius,
  filterColors,
  coloringSet
}) => {
  const narIds = narrative ? narrative.steps.map(s => s.id) : []

  function renderEvent (acc, event) {
    if (narrative) {
      if (!(narIds.includes(event.id))) {
        return null
      }
    }
    const isDot = (isLatitude(event.latitude) && isLongitude(event.longitude)) || (features.GRAPH_NONLOCATED && event.projectOffset !== -1)

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

    // if an event has multiple categories, it should be rendered on each of
    // those timelines: so we create as many event 'shadows' as there are
    // categories
    const evShadows = getEventCategories(event, categories).map(cat => {
      const y = getY({ ...event, category: cat.id })

      let colour = event.colour ? event.colour : getCategoryColor(cat.id)
      const styles = {
        fill: colour,
        fillOpacity: y > 0 ? calcOpacity(1) : 0,
        transition: `transform ${transitionDuration / 1000}s ease`
      }

      return { y, styles }
    })

    function getRender (y, styles) {
      return renderShape(event, styles, {
        x: getDatetimeX(event.datetime),
        y,
        eventRadius,
        onSelect: () => onSelect(event),
        dims,
        highlights: features.HIGHLIGHT_GROUPS ? getHighlights(event.filters[features.HIGHLIGHT_GROUPS.filterIndexIndicatingGroup]) : [],
        features,
        filterColors,
        coloringSet
      })
    }

    if (evShadows.length === 0) {
      acc.push(getRender(getY(event), { fill: getCategoryColor(null) }))
    } else {
      evShadows.forEach(evShadow => {
        acc.push(getRender(evShadow.y, evShadow.styles))
      })
    }
    return acc
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
      {events.reduce(renderEvent, [])}
    </g>
  )
}

export default TimelineEvents
