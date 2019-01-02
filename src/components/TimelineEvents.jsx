import React from 'react';

class TimelineEvents extends React.Component {

  getAllEventsAtOnce(eventPoint) {
    const timestamp = eventPoint.timestamp;
    const category = eventPoint.category;
    return this.props.events
      .filter(event => (event.timestamp === timestamp && category === event.category))
  }

  renderEvent(event) {
    return (
      <circle
        className="event"
        cx={0}
        cy={0}
        style={{
          'transform': `translate(${this.props.getEventX(event)}px, ${this.props.getEventY(event)}px)`,
          'transition': 'transform 0.5s ease'
        }}
        r={5}        
        fill={this.props.getCategoryColor(event.category)}
        onClick={() => {this.props.onSelect(this.getAllEventsAtOnce(event))}}
      >
      </circle>
    )
  }

  render () {
    return (
      <g
        clipPath={"url(#clip)"}
      >
        {this.props.events.map(event => this.renderEvent(event))}
      </g>
    );
  }
}

export default TimelineEvents;