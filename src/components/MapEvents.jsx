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

  renderLocation(location) {
    /**
    {
      events: [...],
      label: 'Location name',
      latitude: '47.7',
      longitude: '32.2'
    }
    */
    const { x, y } = this.projectPoint([location.latitude, location.longitude]);
    // const eventsByCategory = this.getLocationEventsDistribution(location);

    const locCategory = location.events.length > 0 ? location.events[0].category : 'default'
    const customStyles = this.props.styleLocation ? this.props.styleLocation(location) : null
    const extraStyles = customStyles[0]
    const extraRender = customStyles[1]

    const styles = ({
      fill: this.props.getCategoryColor(locCategory),
      fillOpacity: 1,
      ...customStyles[0]
    })

    // in narrative mode, only render events in narrative
    if (this.props.narrative) {
      const { steps } = this.props.narrative
      const onlyIfInNarrative = e => steps.map(s => s.id).includes(e.id)
      const eventsInNarrative = location.events.filter(onlyIfInNarrative)

      if (eventsInNarrative.length <= 0) {
        return null
      }
    }

    return (
      <g
        className="location"
        transform={`translate(${x}, ${y})`}
      >
        <circle
          className="location-event-marker"
          r={7}
          style={styles}
          onClick={() => this.props.onSelect(events)}
        >
        </circle>
        {extraRender ? extraRender() : null}
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
