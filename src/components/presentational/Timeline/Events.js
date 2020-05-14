import React from 'react'
import DatetimeDot from './DatetimeDot'
import DatetimeBar from './DatetimeBar'
import DatetimeSquare from './DatetimeSquare'
import DatetimeStar from './DatetimeStar'
import Project from './Project'
import { calcOpacity } from '../../../common/utilities'
import { sizes } from '../../../common/global'

// return a list of lists, where each list corresponds to a single category
function getDotsToRender (events) {
  // each datetime needs to render as many dots as there are distinct
  // categories in the events contained by the datetime.
  // To this end, eventsByCategory is an intermediate data structure that
  // groups a datetime's events by distinct categories
  const eventsByCategory = {}
  events.forEach(ev => {
    if (eventsByCategory[ev.category]) {
      eventsByCategory[ev.category].events.push((ev))
    } else {
      eventsByCategory[ev.category] = {
        category: ev.category,
        events: [ ev ]
      }
    }
  })

  return Object.values(eventsByCategory)
}
const HAS_PROJECTS = 'ASSOCIATIVE_EVENTS_BY_TAG' in process.env.features && process.env.features.ASSOCIATIVE_EVENTS_BY_TAG

const TimelineEvents = ({
  events,
  datetimes,
  narrative,
  getDatetimeX,
  getCategoryY,
  getCategoryColor,
  onSelect,
  transitionDuration,
  styleDatetime,
  dims
}) => {
  function renderDot (event, colour) {
    const props = ({
      fill: colour,
      fillOpacity: calcOpacity(1),
      transition: `transform ${transitionDuration / 1000}s ease`
    })
    return <DatetimeDot
      onSelect={() => onSelect([event])}
      category={event.category}
      events={[event]}
      x={getDatetimeX(event.timestamp)}
      y={getCategoryY(event.category)}
      r={sizes.eventDotR}
      styleProps={props}
    />
  }

  function renderBar (event, colour) {
    const evOpacity = calcOpacity(1)
    const props = {
      fill: colour,
      fillOpacity: HAS_PROJECTS
        ? event.projectOffset >= 0 ? evOpacity : 0.05
        : 0.6
    }
    return <DatetimeBar
      onSelect={() => onSelect([event])}
      category={event.category}
      events={[event]}
      x={getDatetimeX(event.timestamp)}
      y={dims.marginTop}
      width={sizes.eventDotR / 4}
      height={dims.trackHeight}
      styleProps={props}
    />
  }

  function renderDiamond (event, colour) {
    const props = ({
      fill: colour,
      fillOpacity: calcOpacity(1),
      transition: `transform ${transitionDuration / 1000}s ease`
    })
    return <DatetimeSquare
      onSelect={() => onSelect([event])}
      x={getDatetimeX(event.timestamp)}
      y={getCategoryY(event.category)}
      r={1.8 * sizes.eventDotR}
      styleProps={props}
    />
  }

  function renderStar (event, colour) {
    const props = ({
      fill: colour,
      fillOpacity: calcOpacity(1),
      transition: `transform ${transitionDuration / 1000}s ease`,
      fillRule: 'nonzero'

    })
    return <DatetimeStar
      onSelect={() => onSelect([event])}
      x={getDatetimeX(event.timestamp)}
      y={getCategoryY(event.category)}
      r={1.8 * sizes.eventDotR}
      styleProps={props}
      transform='rotate(90)'
    />
  }

  function renderDatetime (datetime) {
    // narrative checking for non-rendering still uses datetimes as legacy TODO(lachlan)
    if (narrative) {
      const { steps } = narrative
      // check all events in the datetime before rendering in narrative
      let isInNarrative = false
      for (let i = 0; i < datetime.events.length; i++) {
        const event = datetime.events[i]
        if (steps.map(s => s.id).includes(event.id)) {
          isInNarrative = true
          break
        }
      }

      if (!isInNarrative) {
        return null
      }
    }

    /* DEFAULTS TODO(lachlan): clean up */
    const dotsToRender = getDotsToRender(datetime.events)

    return dotsToRender.map(dot => {
      const customStyles = styleDatetime ? styleDatetime(datetime, dot.category) : null
      const extraStyles = customStyles[0]
      const extraRender = customStyles[1]

      // default to category for colour, and located/unlocated for shape
      const locatedEvents = dot.events.filter(ev => ev.latitude && ev.longitude)
      const unlocatedEvents = dot.events.filter(ev => !ev.latitude || !ev.longitude)

      // TODO: work out smarter way to manage opacity w.r.t. length
      // i.e. render (count - 1) extra dots with a bit of noise in position
      // and that, when clicked, all open the same events.

      const unlocatedProps = {
        fillOpacity: HAS_PROJECTS
          ? unlocatedEvents.some(ev => ev.projectOffset >= 0) ? calcOpacity(unlocatedEvents.length) : 0.05
          : calcOpacity(unlocatedEvents.length) / 4
      }

      let bar = <DatetimeBar
        onSelect={() => onSelect(unlocatedEvents)}
        category={dot.category}
        events={unlocatedEvents}
        x={getDatetimeX(datetime.timestamp)}
        y={dims.marginTop}
        width={sizes.eventDotR}
        height={dims.trackHeight}
        styleProps={unlocatedProps}
      />
      if (process.env.features.ASSOCIATIVE_EVENTS_BY_TAG) {
        // render all dots individually
        bar = <React.Fragment>
          {unlocatedEvents.map(ev => (<DatetimeBar
            onSelect={() => onSelect(unlocatedEvents)}
            category={dot.category}
            events={[ev]}
            x={getDatetimeX(datetime.timestamp)}
            y={ev.projectOffset >= 0 ? dims.trackHeight - ev.projectOffset : dims.marginTop}
            width={sizes.eventDotR}
            height={ev.projectOffset >= 0 ? sizes.eventDotR * 2 : dims.trackHeight}
            styleProps={unlocatedProps}
          />))}
        </React.Fragment>
      }
      return (
        <g className='datetime'>
          {locatedEvents.length >= 1 && renderCircle()}
          {unlocatedEvents.length >= 1 && bar}
          {extraRender ? extraRender() : null}
        </g>
      )
    })
  }

  function renderEvent (event) {
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
    return renderShape(event, colour)
  }

  /* set `renderProjects` */
  let renderProjects = () => null
  if (process.env.features.ASSOCIATIVE_EVENTS_BY_TAG) {
    const projects = datetimes[1]
    datetimes = datetimes[0]
    renderProjects = function () {
      return <React.Fragment>
        {projects.map(project => <Project
          {...project}
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
      {/* {datetimes.map(datetime => renderDatetime(datetime))} */}
      {events.map(event => renderEvent(event))}
    </g>
  )
}

export default TimelineEvents
