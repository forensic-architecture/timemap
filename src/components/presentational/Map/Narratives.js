import React from 'react'
import { Portal } from 'react-portal'
// import { concatStatic } from 'rxjs/operator/concat'
// import { single } from 'rxjs/operator/single'

const defaultStyles = {
  strokeOpacity: 1,
  strokeWidth: 0,
  strokeDasharray: 'none',
  stroke: 'none'
}

function MapNarratives ({
  styles,
  onSelectNarrative,
  svg,
  narrative,
  narratives,
  projectPoint,
  features
}) {
  function getNarrativeStyle (narrativeId) {
    const styleName = (narrativeId && narrativeId in styles)
      ? narrativeId
      : 'default'
    return styles[styleName]
  }

  const narrativesExist = narratives && narratives.length !== 0

  function hasNoLocation (step) {
    return (step.latitude === '' || step.longitude === '')
  }

  function _renderNarrativeStepArrow (p1, p2, styles) {
    const distance = Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y))
    const theta = Math.atan2(p2.y - p1.y, p2.x - p1.x) // Angle of narrative step line
    const alpha = Math.atan2(1, 2) // Angle of arrow overture
    const edge = 10 // Arrow edge length
    const offset = (distance < 24) ? distance / 2 : 24

    // Arrow corners
    const coord0 = {
      x: p2.x - offset * Math.cos(theta),
      y: p2.y - offset * Math.sin(theta)
    }
    const coord1 = {
      x: coord0.x - edge * Math.cos(-theta - alpha),
      y: coord0.y + edge * Math.sin(-theta - alpha)
    }
    const coord2 = {
      x: coord0.x - edge * Math.cos(-theta + alpha),
      y: coord0.y + edge * Math.sin(-theta + alpha)
    }

    return (<path
      className='narrative-step-arrow'
      d={`
        M ${coord0.x} ${coord0.y}
        L ${coord1.x} ${coord1.y}
        L ${coord2.x} ${coord2.y} Z
      `}
      style={{
        ...styles,
        fillOpacity: styles.strokeOpacity,
        fill: styles.stroke
      }}
    />)
  }

  function _renderNarrativeStep (p1, p2, styles) {
    const { stroke, strokeWidth, strokeDasharray, strokeOpacity } = styles

    return (
      <g>
        <line
          className='narrative-step'
          x1={p1.x}
          x2={p2.x}
          y1={p1.y}
          y2={p2.y}
          markerStart='none'
          onClick={n => onSelectNarrative(n)}
          style={{
            strokeWidth,
            strokeDasharray,
            strokeOpacity,
            stroke
          }}
        />
        {(stroke !== 'none')
          ? _renderNarrativeStepArrow(p1, p2, styles)
          : ''
        }
      </g>
    )
  }

  function renderBetweenSteps (step1, step2, extraStyles) {
    // don't draw if one of the steps has no location, or not in narrative
    if (hasNoLocation(step1) || hasNoLocation(step2)) {
      return null
    }

    // don't draw if something else is up
    if (!step1 || !step2) {
      return null
    }

    const p1 = projectPoint([step1.latitude, step1.longitude])
    const p2 = projectPoint([step2.latitude, step2.longitude])

    return _renderNarrativeStep(p1, p2, {
      ...defaultStyles,
      ...(extraStyles || {})
    })
  }

  function renderFullNarrative (n) {
    if (n === null || n.id !== narrative.id) {
      return null
    }

    const arrows = []

    for (let idx = 0; idx < n.steps.length - 1; idx += 1) {
      const step1 = n.steps[idx]
      const step2 = n.steps[idx + 1]
      arrows.push(renderBetweenSteps(step1, step2, getNarrativeStyle(n.id)))
    }

    return arrows
  }

  function renderBetweenMarked (n) {
    // this function should only be called if features.NARRATIVE_STEP_STYLES
    // is true, and thus there is a 'stepStyles' attributes in events
    if (n === null || n.id !== narrative.id) {
      return null
    }

    const arrows = []

    let lastMarked = null

    if (narrativesExist) {
      for (let idx = 0; idx < n.steps.length; idx += 1) {
        const step = n.steps[idx]
        if (lastMarked) {
          arrows.push(renderBetweenSteps(
            lastMarked,
            step,
            n.withLines ? { strokeWidth: '1px', stroke: step.colour } : {})
          )
        }
        lastMarked = step
      }
    } else {
      for (let idx = 0; idx < n.steps.length; idx += 1) {
        const step = n.steps[idx]
        const _idx = step.narratives.indexOf(n.id)
        const stepStyle = step.narrative___stepStyles[_idx]

        if (stepStyle !== 'None') {
          if (lastMarked) {
            arrows.push(renderBetweenSteps(lastMarked, step, styles.stepStyles[stepStyle]))
          }
          lastMarked = step
        }
      }
    }

    return arrows
  }

  function renderNarrative (n) {
    const narrativeId = `narrative-${n.id.replace(/ /g, '_')}`

    const body = narrativesExist
      ? renderBetweenMarked(n)
      : (features.NARRATIVE_STEP_STYLES
        ? renderBetweenMarked(n)
        : renderFullNarrative(n))

    return (
      <g id={narrativeId} className='narrative'>
        {body}
      </g>
    )
  }

  // don't render in explore mode
  if (narrative === null) {
    return null
  }

  return (
    <Portal node={svg}>
      <g className='narratives'>
        {narratives.map(renderNarrative)}
      </g>
    </Portal>
  )
}

export default MapNarratives
