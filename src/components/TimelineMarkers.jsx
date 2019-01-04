import React from 'react';

class TimelineMarkers extends React.Component {

  renderMarker(event) {
    return (
      <circle
        className="timeline-marker"
        cx={0}
        cy={0}
        style={{
          'transform': `translate(${this.props.getEventX(event)}px, ${this.props.getEventY(event)}px)`,
          'transition': `transform ${transitionDuration}s ease`,
          'opacity': 0.9
        }}        
        r="10"
      >
      </circle>
    )
  }

  render () {
    return (
      <g
        clipPath={"url(#clip)"}
      >
        {this.props.selected.map(event => this.renderMarker(event))}
      </g>
    );
  }
}

export default TimelineMarkers;