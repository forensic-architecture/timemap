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

  getStepStyle(name) {
    if (name === 'None') return null
    return this.props.narrativeProps.stepStyles[name]
  }

  hasNoLocation(step) {
    return (step.latitude === '' || step.longitude === '')
  }

  renderNarrativeStep(idx, n) {
    const step = n.steps[idx]
    const step2 = n.steps[idx + 1]

    // don't draw if one of the steps has no location
    if (this.hasNoLocation(step) || this.hasNoLocation(step2))
      return null

    // 0 if not in narrative mode, 1 if active narrative, 0.1 if inactive
    let styles = {
      strokeOpacity:  (n === null) ? 0
      : (step && (n.id === this.props.narrative.id)) ? 1 : 0.1,
      strokeWidth: 0,
      strokeDasharray: 'none',
      stroke: 'none'
    }

    const p1  = this.projectPoint([step.latitude, step.longitude])
    const p2 = this.projectPoint([step2.latitude, step2.longitude])

    if (step) {
      if (process.env.features.NARRATIVE_STEP_STYLES) {
        const _idx = step.narratives.indexOf(n.id)
        const stepStyle = step.narrative___stepStyles[_idx]

        return this._renderNarrativeStep(
          p1,
          p2,
          { ...styles, ...this.getStepStyle(stepStyle) }
        )

      // otherwise steps are styled per narrative
      } else {
        styles = {
          ...styles,
          ...this.getNarrativeStyle(n.id)
        }
        return this._renderNarrativeStep(p1,p2,styles)
      }
    }

  }

  _renderNarrativeStep(p1, p2, styles) {
    const { stroke, strokeWidth, strokeDasharray, strokeOpacity } = styles
    return (
      <line
        className="narrative-step"
        x1={p1.x}
        x2={p2.x}
        y1={p1.y}
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
        {steps.map((s, idx) => this.renderNarrativeStep(idx, n))}
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
