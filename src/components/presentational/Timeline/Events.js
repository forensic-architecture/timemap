import React from 'react'
import DatetimeDot from './DatetimeDot'

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
      const extraRender = customStyles[1]

      const styleProps = ({
        fill: getCategoryColor(dot.category),
        fillOpacity: 1,
        transition: `transform ${transitionDuration / 1000}s ease`,
        ...extraStyles
      })

      return (
        <DatetimeDot
          onSelect={onSelect}
          category={dot.category}
          events={dot.events}
          x={getDatetimeX(datetime)}
          y={getCategoryY(dot.category)}
          styleProps={styleProps}
          extraRender={extraRender}
        />
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
