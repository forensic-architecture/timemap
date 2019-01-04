import React from 'react'
import { Portal } from 'react-portal'

class MapNarratives extends React.Component {

  projectPoint(location) {
    const latLng = new L.LatLng(location[0], location[1])
    return {
      x: this.props.map.latLngToLayerPoint(latLng).x + this.props.mapTransformX,
      y: this.props.map.latLngToLayerPoint(latLng).y + this.props.mapTransformY
    }
  }

  getNarrativeStyle(narrativeId) {
    const styleName = (narrativeId && narrativeId in this.props.narrativeProps)
      ? narrativeId
      : 'default'
    return this.props.narrativeProps[styleName]
  }

  getStrokeOpacity(narrative, step) {
    if (this.props.narrative === null) return 0
    if (!step || narrative.id !== this.props.narrative.id) return 0.1
    return 1
  }

  hasNoLocation(step) {
    return (step.latitude === '' || step.longitude === '')
  }

  renderNarrativeStep(idx, n, stepStyle = null) {
    const step = n.steps[idx]
    const step2 = n.steps[idx + 1]

    // don't draw if one of the steps has no location
    if (this.hasNoLocation(step) || this.hasNoLocation(step2))
      return null

    const { narrative } = this.props
    const { x, y } = this.projectPoint([step.latitude, step.longitude])
    const p2 = this.projectPoint([step2.latitude, step2.longitude])

    // 0 if not in narrative mode, 1 if active narrative, 0.1 if inactive
    const strokeOpacity = (n === null) ? 0
      : (step && (n.id === narrative.id)) ? 1 : 0.1
    let strokeWidth = 0
    let strokeDasharray = 'none'
    let stroke = 'none'

    // style narartive step if appropriate
    if (step) {
      // stepStyle only provided to functionl if NARRATIVE_STEP_STYLES enabled
      if (!!stepStyle) {
        console.log('TODO: step by step styling')
      // otherwise steps are styled per narrative
      } else {
        const narStyle = this.getNarrativeStyle(n.id)
        stroke = narStyle.stroke
        strokeWidth = narStyle.strokeWidth
        strokeDasharray = narStyle.strokeDasharray
      }
    }

    return (
      <line
        className="narrative-step"
        x1={x}
        x2={p2.x}
        y1={y}
        y2={p2.y}
        markerStart="none"
        onClick={() => this.props.onSelectNarrative(n)}
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

  renderNarrative(n) {
    const steps = n.steps.slice(0, n.steps.length - 1)

    return (
      <g id={`narrative-${n.id.replace(/ /g,"_")}`} className="narrative">
        {steps.map((s, idx) => {
          if (process.env.features.NARRATIVE_STEP_STYLES) {
            const _idx = s.narratives.indexOf(n.id)
            const stepStyle = s.narrative___stepStyles[_idx]
            if (stepStyle !== 'None')
              return this.renderNarrativeStep(idx, n, stepStyle)
          } else {
            return this.renderNarrativeStep(idx, n)
          }
        })}
      </g>
    )
  }

  render() {
    if (this.props.narrative === null) return (<div />)

    return (
      <Portal node={this.props.svg}>
        {this.props.narratives.map(n => this.renderNarrative(n))}
      </Portal>
    )
  }
}

export default MapNarratives
