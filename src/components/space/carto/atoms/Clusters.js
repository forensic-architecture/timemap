import React, { useState } from "react";
import { Portal } from "react-portal";
import colors from "../../../../common/global";
import { COLORING_ALGORITHM_MODE } from "../../../../common/constants";
import ColoredMarkers from "../../../atoms/ColoredMarkers";
import {
  calcClusterOpacity,
  calcClusterSize,
  isLatitude,
  isLongitude,
  calculateColorPercentages,
  zipColorsToPercentages,
  calculateTotalClusterPoints,
  appendFiltersToColoringSet,
  getStaticFilterColorSet,
} from "../../../../common/utilities";

const DefsClusters = () => (
  <defs>
    <radialGradient id="clusterGradient">
      <stop offset="10%" stop-color="red" />
      <stop offset="90%" stop-color="transparent" />
    </radialGradient>
  </defs>
);

function Cluster({
  cluster,
  size,
  projectPoint,
  totalPoints,
  styles,
  renderHover,
  onClick,
  getClusterChildren,
  coloringSet,
  filters,
  coloringConfig,
}) {
  /**
  {
    geometry: {
      coordinates: [longitude, latitude]
    },
    properties: {
      cluster: true|false,
      cluster_id: int,
      point_count: int,
      point_count_abbreviated: int
    },
    type: "Feature"
  }
  */
  const { mode, colors, defaultColor } = coloringConfig;
  const { cluster_id: clusterId } = cluster.properties;

  const individualChildren = getClusterChildren(clusterId);

  const updatedColoringSet =
    mode === COLORING_ALGORITHM_MODE.STATIC
      ? appendFiltersToColoringSet(filters, coloringSet)
      : coloringSet;
  const updatedFilterColors =
    mode === COLORING_ALGORITHM_MODE.STATIC
      ? getStaticFilterColorSet(filters, updatedColoringSet, defaultColor)
      : colors;

  const colorPercentages = calculateColorPercentages(
    individualChildren,
    updatedColoringSet
  );

  const { coordinates } = cluster.geometry;
  const [longitude, latitude] = coordinates;
  const { x, y } = projectPoint([latitude, longitude]);
  const [hovered, setHovered] = useState(false);
  if (!isLatitude(latitude) || !isLongitude(longitude)) return null;

  return (
    <svg>
      <g
        className="cluster-event"
        transform={`translate(${x}, ${y})`}
        onClick={(e) => onClick({ id: clusterId, latitude, longitude })}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <ColoredMarkers
          radius={size}
          colorPercentMap={zipColorsToPercentages(
            updatedFilterColors,
            colorPercentages
          )}
          styles={{
            ...styles,
          }}
          className="cluster-event-marker"
        />
        {hovered ? renderHover() : null}
      </g>
    </svg>
  );
}

function ClusterEvents({
  projectPoint,
  onSelect,
  getClusterChildren,
  coloringSet,
  isRadial,
  svg,
  clusters,
  selected,
  filters,
  coloringConfig,
}) {
  const totalPoints = calculateTotalClusterPoints(clusters);

  const styles = {
    fill: isRadial ? "url('#clusterGradient')" : colors.fallbackEventColor,
    stroke: colors.darkBackground,
    strokeWidth: 0,
  };

  function renderHover(txt, circleSize) {
    return (
      <>
        <text
          textAnchor="middle"
          y="3px"
          style={{ fontWeight: "bold", fill: "black", zIndex: 10000 }}
        >
          {txt}
        </text>
        <circle
          className="event-hover"
          cx="0"
          cy="0"
          r={circleSize + 2}
          stroke={colors.primaryHighlight}
          fillOpacity="0.0"
        />
      </>
    );
  }

  return (
    <Portal node={svg}>
      <svg>
        <g className="cluster-locations">
          {isRadial ? <DefsClusters /> : null}
          {clusters.map((c) => {
            const pointCount = c.properties.point_count;
            const clusterSize = calcClusterSize(pointCount, totalPoints);
            return (
              <Cluster
                onClick={onSelect}
                getClusterChildren={getClusterChildren}
                coloringSet={coloringSet}
                cluster={c}
                size={clusterSize}
                projectPoint={projectPoint}
                totalPoints={totalPoints}
                filters={filters}
                coloringConfig={coloringConfig}
                styles={{
                  ...styles,
                  fillOpacity: calcClusterOpacity(pointCount, totalPoints),
                }}
                renderHover={() => renderHover(pointCount, clusterSize)}
              />
            );
          })}
        </g>
      </svg>
    </Portal>
  );
}

export default ClusterEvents;
