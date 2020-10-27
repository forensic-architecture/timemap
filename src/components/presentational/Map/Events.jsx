import React from 'react'
import { Portal } from 'react-portal'
import colors from '../../../common/global.js'
import ColoredMarkers from './ColoredMarkers.jsx'
import { calcOpacity, getCoordinatesForPercent, calculateColorPercentages, zipColorsToPercentages } from '../../../common/utilities'

function MapEvents ({
  getCategoryColor,
  categories,
  projectPoint,
  styleLocation,
  selected,
  narrative,
  onSelect,
  svg,
  locations,
  eventRadius,
  coloringSet,
  filterColors,
  features
}) {
  function handleEventSelect (e, location) {
    const events = e.shiftKey ? selected.concat(location.events) : location.events
    onSelect(events)
  }

  function renderBorder () {
    return (
      <React.Fragment>
        {<circle
          class='event-hover'
          cx='0'
          cy='0'
          r='10'
          stroke={colors.primaryHighlight}
          fill-opacity='0.0'
        />}
      </React.Fragment>
    )
  }

  function renderLocationSlicesByAssociation (location) {
    const colorPercentages = calculateColorPercentages([location], coloringSet)

    let styles = ({
      stroke: colors.darkBackground,
      strokeWidth: 0,
      fillOpacity: narrative ? 1 : calcOpacity(location.events.length)
    })

    return (
      <ColoredMarkers
        radius={eventRadius}
        colorPercentMap={zipColorsToPercentages(filterColors, colorPercentages)}
        styles={{
          ...styles
        }}
        className={'location-event-marker'}
      />
    )
  }

  function renderLocationSlicesByCategory (location) {
    const locCategory = location.events.length > 0 ? location.events[0].category : 'default'
    const customStyles = styleLocation ? styleLocation(location) : null
    const extraStyles = customStyles[0]

    let styles = ({
      fill: getCategoryColor(locCategory),
      stroke: colors.darkBackground,
      strokeWidth: 0,
      fillOpacity: narrative ? 1 : calcOpacity(location.events.length),
      ...extraStyles
    })

    const colorSlices = location.events.map(e => e.colour ? e.colour : getCategoryColor(e.category))

    let cumulativeAngleSweep = 0

    return (
      <React.Fragment>
        {colorSlices.map((color, idx) => {
          const r = eventRadius

          // Based on the number of events in each location,
          // create a slice per event filled with its category color
          const [startX, startY] = getCoordinatesForPercent(r, cumulativeAngleSweep)

          cumulativeAngleSweep = (idx + 1) / colorSlices.length

          const [endX, endY] = getCoordinatesForPercent(r, cumulativeAngleSweep)

          // if the slices are less than 2, take the long arc
          const largeArcFlag = (colorSlices.length === 1) ? 1 : 0

          // create an array and join it just for code readability
          const arc = [
            `M ${startX} ${startY}`, // Move
            `A ${r} ${r} 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
            `L 0 0 `, // Line
            `L ${startX} ${startY} Z` // Line
          ].join(' ')

          const extraStyles = ({
            ...styles,
            fill: color
          })

          return (
            <path
              class='location-event-marker'
              id={`arc_${idx}`}
              d={arc}
              style={extraStyles}
            />
          )
        })}

      </React.Fragment>
    )
  }

  function renderLocation (location) {
    /**
    {
      events: [...],
      label: 'Location name',
      latitude: '47.7',
      longitude: '32.2'
    }
    */
    if (!location.latitude || !location.longitude) return null
    const { x, y } = projectPoint([location.latitude, location.longitude])

    // in narrative mode, only render events in narrative
    // TODO: move this to a selector
    if (narrative) {
      const { steps } = narrative
      const onlyIfInNarrative = e => steps.map(s => s.id).includes(e.id)
      const eventsInNarrative = location.events.filter(onlyIfInNarrative)

      if (eventsInNarrative.length <= 0) {
        return null
      }
    }

    const customStyles = styleLocation ? styleLocation(location) : null
    const extraRender = () => (
      <React.Fragment>
        {customStyles[1]}
      </React.Fragment>
    )

    const isSelected = selected.reduce((acc, event) => {
      return acc || (event.latitude === location.latitude && event.longitude === location.longitude)
    }, false)

    return (
      <g
        className={`location-event ${narrative ? 'no-hover' : ''}`}
        transform={`translate(${x}, ${y})`}
        onClick={(e) => handleEventSelect(e, location)}
      >
        {features.COLOR_BY_ASSOCIATION ? renderLocationSlicesByAssociation(location) : null}
        {features.COLOR_BY_CATEGORY ? renderLocationSlicesByCategory(location) : null}
        {extraRender ? extraRender() : null}
        {isSelected ? null : renderBorder()}
      </g>
    )
  }

  return (
    <Portal node={svg}>
      <g className='event-locations'>
        {locations.map(renderLocation)}
      </g>
    </Portal>
  )
}

export default MapEvents
