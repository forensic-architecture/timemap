import React, { useState } from 'react'
import { Portal } from 'react-portal'
import colors from '../../../common/global.js'
import { calcClusterOpacity, calcClusterSize, isLatitude, isLongitude } from '../../../common/utilities'

const DefsClusters = () => (
  <defs>
    <radialGradient id='clusterGradient'>
      <stop offset='10%' stop-color='red' />
      <stop offset='90%' stop-color='transparent' />
    </radialGradient>
  </defs>
)

function Cluster ({ cluster, size, projectPoint, totalPoints, styles, renderHover, onClick }) {
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
      <circle
        class='cluster-event-marker'
        id={clusterId}
        longitude={longitude}
        latitude={latitude}
        cx='0'
        cy='0'
        r={size}
        style={{
          ...styles
        }}
      />
      {hovered ? renderHover(cluster) : null}

    </g>
  )
}

function ClusterEvents ({
  projectPoint,
  onSelect,
  isRadial,
  svg,
  clusters
}) {
  const totalPoints = clusters.reduce((total, cl) => {
    if (cl && cl.properties) {
      total += cl.properties.point_count
    }
    return total
  }, 0)

  const styles = {
    fill: isRadial ? "url('#clusterGradient')" : colors.fallbackEventColor,
    stroke: colors.darkBackground,
    strokeWidth: 0
  }

  function renderHover (txt) {
    return <text text-anchor='middle' y='-3px' style={{ fontWeight: 'bold', fill: 'white' }}>{txt}</text>
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
            cluster={c}
            size={clusterSize}
            projectPoint={projectPoint}
            totalPoints={totalPoints}
            styles={{
              ...styles,
              fillOpacity: calcClusterOpacity(pointCount, totalPoints)
            }}
            renderHover={clster => <>
              <circle
                class='event-hover'
                cx='0'
                cy='0'
                r={clusterSize + 2}
                stroke={colors.primaryHighlight}
                fill-opacity='0.0'
              />
              {renderHover(pointCount)}
            </>}
          />
        })}
      </g>
    </Portal>
  )
}

export default ClusterEvents
