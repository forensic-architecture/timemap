import React, { useState } from 'react'
import { Portal } from 'react-portal'
import colors from '../../../common/global.js'
import ColoredMarkers from './ColoredMarkers.jsx'
import {
  calcClusterOpacity,
  calcClusterSize,
  isLatitude,
  isLongitude,
  calculateColorPercentages,
  zipColorsToPercentages,
  calculateTotalClusterPoints } from '../../../common/utilities'

const DefsClusters = () => (
  <defs>
    <radialGradient id='clusterGradient'>
      <stop offset='10%' stop-color='red' />
      <stop offset='90%' stop-color='transparent' />
    </radialGradient>
  </defs>
)

function Cluster ({ cluster, size, projectPoint, totalPoints, styles, renderHover, onClick, getClusterChildren, coloringSet, filterColors }) {
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
  const { cluster_id: clusterId } = cluster.properties

  const individualChildren = getClusterChildren(clusterId)
  const colorPercentages = calculateColorPercentages(individualChildren, coloringSet)

  const { coordinates } = cluster.geometry
  const [longitude, latitude] = coordinates
  if (!isLatitude(latitude) || !isLongitude(longitude)) return null
  const { x, y } = projectPoint([latitude, longitude])
  const [hovered, setHovered] = useState(false)

  return (
    <g
      className={'cluster-event'}
      transform={`translate(${x}, ${y})`}
      onClick={e => onClick({ id: clusterId, latitude, longitude })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ColoredMarkers
        radius={size}
        colorPercentMap={zipColorsToPercentages(filterColors, colorPercentages)}
        styles={{
          ...styles
        }}
        className={'cluster-event-marker'}
      />
      {hovered ? renderHover(cluster) : null}
    </g>
  )
}

function ClusterEvents ({
  projectPoint,
  onSelect,
  getClusterChildren,
  coloringSet,
  isRadial,
  svg,
  clusters,
  filterColors,
  selected
}) {
  const totalPoints = calculateTotalClusterPoints(clusters)

  const styles = {
    fill: isRadial ? "url('#clusterGradient')" : colors.fallbackEventColor,
    stroke: colors.darkBackground,
    strokeWidth: 0
  }

  function renderHover (txt, circleSize) {
    return <>
      <text text-anchor='middle' y='3px' style={{ fontWeight: 'bold', fill: 'black', zIndex: 10000 }}>{txt}</text>
      <circle
        class='event-hover'
        cx='0'
        cy='0'
        r={circleSize + 2}
        stroke={colors.primaryHighlight}
        fill-opacity='0.0'
      />
    </>
  }

  return (
    <Portal node={svg}>
      <g className='cluster-locations'>
        {isRadial ? <DefsClusters /> : null}
        {clusters.map(c => {
          const pointCount = c.properties.point_count
          const clusterSize = calcClusterSize(pointCount, totalPoints)
          return <Cluster
            onClick={onSelect}
            getClusterChildren={getClusterChildren}
            coloringSet={coloringSet}
            cluster={c}
            filterColors={filterColors}
            size={clusterSize}
            projectPoint={projectPoint}
            totalPoints={totalPoints}
            styles={{
              ...styles,
              fillOpacity: calcClusterOpacity(pointCount, totalPoints)
            }}
            renderHover={() => renderHover(pointCount, clusterSize)}
          />
        })}
      </g>
    </Portal>
  )
}

export default ClusterEvents
