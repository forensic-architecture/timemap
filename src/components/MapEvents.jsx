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
      eventCount[cat.category] = [];
    });

    location.events.forEach((event) => {;
      eventCount[event.category].push(event);
    });

    return eventCount;
  }

  renderCategory(events, category) {
    return (
      <circle
        className="location-event-marker"
        r={(events) ? Math.sqrt(16 * events.length) + 3 : 0}
        style={{ fill: this.props.getCategoryColor(category), fillOpacity: 0.8 }}
        onClick={() => this.props.onSelect(events)}
      >
      </circle>
    );
  }

  renderLocation(location) {
    const { x, y } = this.projectPoint([location.latitude, location.longitude]);
    const eventsByCategory = this.getLocationEventsDistribution(location);

    return (
      <g
        className="location"
        transform={`translate(${x}, ${y})`}
      >
        {Object.keys(eventsByCategory).map(cat => {
          return this.renderCategory(eventsByCategory[cat], cat)
        })}
      </g>
    )
  }

  render() {
    return (
      <Portal node={this.props.svg}>
        {this.props.locations.map(loc => this.renderLocation(loc))}
      </Portal>
    );
  }
}

export default MapEvents;