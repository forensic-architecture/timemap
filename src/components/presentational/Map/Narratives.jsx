import React from 'react'
import { Portal } from 'react-portal'
// import { concatStatic } from 'rxjs/operator/concat'
// import { single } from 'rxjs/operator/single'

function MapNarratives ({ styles, onSelectNarrative, svg, narrative, narratives, projectPoint }) {
  function getNarrativeStyle (narrativeId) {
    const styleName = (narrativeId && narrativeId in styles)
      ? narrativeId
      : 'default'
    return styles[styleName]
  }

  function getStepStyle (name) {
    if (name === 'None') return null
    return styles.stepStyles[name]
  }

  function hasNoLocation (step) {
    return (step.latitude === '' || step.longitude === '')
  }

  function renderNarrativeStep (idx, n) {
    const step = n.steps[idx]
    const step2 = n.steps[idx + 1]

    // don't draw if one of the steps has no location
    if (hasNoLocation(step) || hasNoLocation(step2)) { return null }

    // 0 if not in narrative mode, 1 if active narrative, 0.1 if inactive
    let styles = {
      strokeOpacity: (n === null) ? 0
        : (step && (n.id === narrative.id)) ? 1 : 0.0,
      strokeWidth: 0,
      strokeDasharray: 'none',
      stroke: 'none'
    }

    const p1 = projectPoint([step.latitude, step.longitude])
    const p2 = projectPoint([step2.latitude, step2.longitude])

    if (step) {
      if (process.env.features.NARRATIVE_STEP_STYLES) {
        const _idx = step.narratives.indexOf(n.id)
        const stepStyle = step.narrative___stepStyles[_idx]

        return _renderNarrativeStep(
          p1,
          p2,
          { ...styles, ...getStepStyle(stepStyle) }
        )

      // otherwise steps are styled per narrative
      } else {
        styles = {
          ...styles,
          ...getNarrativeStyle(n.id)
        }
        return _renderNarrativeStep(p1, p2, styles)
      }
    }
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

  function renderNarrative (n) {
    const steps = n.steps.slice(0, n.steps.length - 1)

    return (
      <g id={`narrative-${n.id.replace(/ /g, '_')}`} className='narrative'>
        {steps.map((s, idx) => renderNarrativeStep(idx, n))}
      </g>
    )
  }

  if (narrative === null) return (<div />)

  return (
    <Portal node={svg}>
      {narratives.map(n => renderNarrative(n))}
    </Portal>
  )
}

export default MapNarratives
