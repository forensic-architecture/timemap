import React from 'react'
import DatetimeDot from './DatetimeDot'
import DatetimeBar from './DatetimeBar'
import Project from './Project'
import { getEventOpacity } from '../../../common/utilities'
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
  function renderDatetime (datetime) {
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

    const dotsToRender = getDotsToRender(datetime.events)

    return dotsToRender.map(dot => {
      const customStyles = styleDatetime ? styleDatetime(datetime, dot.category) : null
      const extraStyles = customStyles[0]

      const categoryColor = getCategoryColor(dot.category)
      const locatedEvents = dot.events.filter(ev => ev.latitude && ev.longitude)
      const unlocatedEvents = dot.events.filter(ev => !ev.latitude || !ev.longitude)

      // TODO: work out smarter way to manage opacity w.r.t. length
      // i.e. render (count - 1) extra dots with a bit of noise in position
      // and that, when clicked, all open the same events.
      const locatedProps = ({
        fill: categoryColor,
        fillOpacity: getEventOpacity(locatedEvents),
        transition: `transform ${transitionDuration / 1000}s ease`,
        ...extraStyles
      })

      const unlocatedProps = {
        fill: categoryColor,
        fillOpacity: HAS_PROJECTS
          ? unlocatedEvents.some(ev => ev.projectOffset >= 0) ? getEventOpacity(unlocatedEvents) : 0.05
          : getEventOpacity(unlocatedEvents) / 4
      }

      const extraRender = customStyles[1]

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
          {locatedEvents.length >= 1 && <DatetimeDot
            onSelect={() => onSelect(locatedEvents)}
            category={dot.category}
            events={locatedEvents}
            x={getDatetimeX(datetime.timestamp)}
            y={getCategoryY(dot.category)}
            r={sizes.eventDotR}
            styleProps={locatedProps}
            extraRender={extraRender}
          />}
          {unlocatedEvents.length >= 1 && bar}
          {extraRender ? extraRender() : null}
        </g>
      )
    })
  }

  // const projOffsets = {}
  // const pEvents = datetimes.filter(dt => dt.events.some(ev => ev.project !== null))
  // pEvents.forEach(({ events }) => {
  //   events.forEach(ev => {
  //     if (!projOffsets.hasOwnProperty(ev.project)) {
  //       projOffsets[ev.project] = ev.projectOffset
  //     }
  //   })
  // })

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
      {datetimes.map(datetime => renderDatetime(datetime))}
    </g>
  )
}

export default TimelineEvents
