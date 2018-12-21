import React from 'react';

class TimelineZoomControls extends React.Component {

  renderZoom(zoom, idx) {
    return (
      <text
        className={`zoom-level-button ${zoom.active ? 'active' : ''}`}
        x="60"
        y={(idx * 15) + 20}
        onClick={() => this.props.onApplyZoom(zoom)}
      >
        {zoom.label}
      </text>
    )
  }

  render() {
    const dims = this.props.dims;

    return (
      <g transform={`translate(${dims.width - dims.width_controls}, 0)`}>
        {this.props.zoomLevels.map((z, idx) => this.renderZoom(z, idx))}
      </g>
    );
  }
}

export default TimelineZoomControls;