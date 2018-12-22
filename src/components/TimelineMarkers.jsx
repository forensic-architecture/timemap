import React from 'react';

class TimelineMarkers extends React.Component {

  renderMarker(event) {
    return (
      <circle
        className="timeline-marker"
        cx={this.props.getEventX(event)}
        cy={this.props.getEventY(event)}
        r="10"
        style={{ opacity: "0.9" }}
      >
      </circle>
    )
  }

  render () {
    return (
      <g>
        {this.props.selected.map(event => this.renderMarker(event))}
      </g>
    );
  }
}

export default TimelineMarkers;