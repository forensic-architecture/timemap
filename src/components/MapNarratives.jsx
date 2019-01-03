import React from 'react';
import { Portal } from 'react-portal';

class MapNarratives extends React.Component {

  projectPoint(location) {
    const latLng = new L.LatLng(location[0], location[1]);
    return {
      x: this.props.map.latLngToLayerPoint(latLng).x + this.props.mapTransformX,
      y: this.props.map.latLngToLayerPoint(latLng).y + this.props.mapTransformY
    };
  }

  getNarrativeStyle(narrativeId) {
    const styleName = (narrativeId && narrativeId in this.props.narrativeProps)
      ? narrativeId
      : 'default';
    return this.props.narrativeProps[styleName];
  }

  getStrokeWidth(narrative, step) {
    if (!step) return 0;
    return this.getNarrativeStyle(narrative.id).strokeWidth;
  }

  getStrokeDashArray(narrative, step) {
    if (!step) return 'none';
    return (this.getNarrativeStyle(narrative.id).style === 'dotted') ? "2px 5px" : 'none';
  }

  getStroke(narrative, step) {
    if (!step || this.props.narrative === null) return 'none';
    return this.getNarrativeStyle(narrative.id).stroke;
  }

  getStrokeOpacity(narrative, step) {
    if (this.props.narrative === null) return 0;
    if (!step || narrative.id !== this.props.narrative.id) return 0.1;
    return 1;
  }

  hasNoLocation(step) {
    return (step.latitude === '' || step.longitude === '')
  }

  renderNarrativeStep(allSteps, step, idx, n) {
    const { x, y } = this.projectPoint([step.latitude, step.longitude]);
    const step2 = allSteps[idx + 1];

    // don't draw if one of the steps has no location
    if (this.hasNoLocation(step) || this.hasNoLocation(step2))
      return null

    const p2 = this.projectPoint([step2.latitude, step2.longitude]);

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
          strokeWidth: this.getStrokeWidth(n, step),
          strokeDasharray: this.getStrokeDashArray(n, step),
          strokeOpacity: this.getStrokeOpacity(n, step),
          stroke: this.getStroke(n, step)
        }}
      >
      </line>
    );
  }

  renderNarrative(n) {
    // TODO: representation for narrative lines
    // const steps = n.steps.slice(0, n.steps.length - 1);
    //
    // return (
    //   <g id={`narrative-${n.id.replace(/ /g,"_")}`} className="narrative">
    //     {steps.map((s, idx) => this.renderNarrativeStep(n.steps, s, idx, n))}
    //   </g>
    // )
    return null
  }

  render() {
    if (this.props.narrative === null) return (<div />);

    return (
      <Portal node={this.props.svg}>
        {this.props.narratives.map(n => this.renderNarrative(n))}
      </Portal>
    );
  }
}

export default MapNarratives;
