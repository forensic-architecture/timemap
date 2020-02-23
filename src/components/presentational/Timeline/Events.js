import React from 'react'
import DatetimeDot from './DatetimeDot'
import { getEventOpacity } from '../../../common/utilities'

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

const TimelineEvents = ({
  datetimes,
  narrative,
  getDatetimeX,
  getCategoryY,
  getCategoryColor,
  onSelect,
  transitionDuration,
  styleDatetime
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

      // const isLocated = dot.events.map(ev => !ev.latitude || !ev.longitude)

      // TODO: work out smarter way to manage opacity w.r.t. length
      // i.e. render (count - 1) extra dots with a bit of noise in position
      // and that, when clicked, all open the same events.
      const styleProps = ({
        fill: getCategoryColor(dot.category),
        fillOpacity: getEventOpacity(dot.events),
        transition: `transform ${transitionDuration / 1000}s ease`,
        ...extraStyles
      })

      const extraRender = () => (
        <React.Fragment>
          {customStyles[1]}
        </React.Fragment>
      )

      return (<React.Fragment>
        <DatetimeDot
          onSelect={onSelect}
          category={dot.category}
          events={dot.events}
          x={getDatetimeX(datetime)}
          y={getCategoryY(dot.category)}
          styleProps={styleProps}
          extraRender={extraRender}
        />
      </React.Fragment>
      )
    })
  }

  // console.log(datetimes
  //   .filter(d => d.events.some(e => e.category !== 'Legislation'))
  // )

  return (
    <g
      clipPath={'url(#clip)'}
    >
      {datetimes.map(datetime => renderDatetime(datetime))}
    </g>
  )
}

export default TimelineEvents
