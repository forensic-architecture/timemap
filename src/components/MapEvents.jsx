import React from 'react';
import { Portal } from 'react-portal';

class MapEvents extends React.Component {

  projectPoint(location) {
    const latLng = new L.LatLng(location[0], location[1]);
    return {
      x: this.props.map.latLngToLayerPoint(latLng).x + this.props.mapTransformX,
      y: this.props.map.latLngToLayerPoint(latLng).y + this.props.mapTransformY
    };
  }

  getLocationEventsDistribution(location) {
    const eventCount = {};
    const categories = this.props.categories;

    categories.forEach(cat => {
      eventCount[cat.category] = 0
    });

    location.events.forEach((event) => {;
      eventCount[event.category] += 1;
    });

    let i = 0;
    const events = [];

    while (i < categories.length) {
      let _eventsCount = eventCount[categories[i].category];
      for (let j = i + 1; j < categories.length; j++) {
        _eventsCount += eventCount[categories[j].category];
      }
      events.push(_eventsCount);
      i++;
    }
    return events;
  }

  renderCategory(counts, events) {
    return (
      <circle
        className="location-event-marker"
        r={(counts) ? Math.sqrt(16 * counts) + 3 : 0}
        style={{ fill: 'yellow'/*this.props.getCategoryColor(events[0])*/, fillOpacity: 0.2 }}
        onClick={() => this.props.onSelect(events)}
      >
      </circle>
    );
  }

  renderLocation(location) {
    const { x, y } = this.projectPoint([location.latitude, location.longitude]);
    const eventsCounts = this.getLocationEventsDistribution(location);

    return (
      <g
        className="location"
        transform={`translate(${x}, ${y})`}
      >
        {eventsCounts.map(eventsCount => this.renderCategory(eventsCount, location.events))}
      </g>
    )
  }

  render() {

    return (
      <Portal node={this.props.svg.node()}>
        {this.props.locations.map(loc => this.renderLocation(loc))}
      </Portal>
    );
  }
}

export default MapEvents;