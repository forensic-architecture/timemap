import React from "react";
import { colors } from "../../../../common/global";
import { Portal } from "react-portal";

class SpotlightMapEvents extends React.Component {
  renderDefsSpotlights() {
    return (
      <defs>
        <linearGradient id="spotlight-gradient">
          <stop offset="50%" stop-color="white" />
          <stop offset="50%" stop-color={`${colors.yellow}`} />
        </linearGradient>
      </defs>
    );
  }

  renderMarker(marker) {
    const { x, y } = this.props.projectPoint([
      marker.latitude,
      marker.longitude,
    ]);
    const styles = marker.styles;
    const r = marker.radius ? marker.radius + 5 : 24;
    return (
      <g className="spotlight-marker" transform={`translate(${x - r}, ${y})`}>
        <path
          className="spotlight-interactive"
          stroke="url(#spotlight-gradient)"
          stroke-opacity="1"
          stroke-width={styles ? styles.strokeWidth : 2}
          stroke-linecap=""
          stroke-linejoin="round"
          stroke-dasharray={styles ? styles.strokeDasharray : "2"}
          fill="none"
          d={`M0,0a${r},${r} 0 1,0 ${r * 2},0 a${r},${r} 0 1,0 -${r * 2},0 `}
        />
      </g>
    );
  }

  render() {
    return (
      <Portal node={this.props.svg}>
        {this.renderDefsSpotlights()}
        {this.props.selected.map((s) => this.renderMarker(s))}
      </Portal>
    );
  }
}
export default SpotlightMapEvents;
