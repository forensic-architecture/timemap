import React from 'react'
import { Portal } from 'react-portal'

function MapNarratives ({ narrativeProps, onSelectNarrative, svg, narrative, narratives, projectPoint }) {
  function getNarrativeStyle(narrativeId) {
    const styleName = (narrativeId && narrativeId in narrativeProps)
      ? narrativeId
      : 'default'
    return narrativeProps[styleName]
  }

  function getStepStyle(name) {
    if (name === 'None') return null
    return narrativeProps.stepStyles[name]
  }

  function hasNoLocation(step) {
    return (step.latitude === '' || step.longitude === '')
  }

  function renderNarrativeStep(idx, n) {
    const step = n.steps[idx]
    const step2 = n.steps[idx + 1]

    // don't draw if one of the steps has no location
    if (hasNoLocation(step) || hasNoLocation(step2))
      return null

    // 0 if not in narrative mode, 1 if active narrative, 0.1 if inactive
    let styles = {
      strokeOpacity:  (n === null) ? 0
      : (step && (n.id === narrative.id)) ? 1 : 0.1,
      strokeWidth: 0,
      strokeDasharray: 'none',
      stroke: 'none'
    }

    const p1  = projectPoint([step.latitude, step.longitude])
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
        return _renderNarrativeStep(p1,p2,styles)
      }
    }

  }

  function _renderNarrativeStep(p1, p2, styles) {
    const { stroke, strokeWidth, strokeDasharray, strokeOpacity } = styles
    return (
      <line
        className="narrative-step"
        x1={p1.x}
        x2={p2.x}
        y1={p1.y}
        y2={p2.y}
        markerStart="none"
        onClick={() => onSelectNarrative(n)}
        style={{
          strokeWidth,
          strokeDasharray,
          strokeOpacity,
          stroke,
        }}
      >
      </line>
    )

  }

  function renderNarrative(n) {
    const steps = n.steps.slice(0, n.steps.length - 1)

    return (
      <g id={`narrative-${n.id.replace(/ /g,"_")}`} className="narrative">
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
