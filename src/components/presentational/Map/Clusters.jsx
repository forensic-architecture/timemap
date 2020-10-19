import React from 'react'
import { Portal } from 'react-portal'
import colors from '../../../common/global.js'
import { calcClusterOpacity, calcClusterSize } from '../../../common/utilities'

const DefsClusters = () => (
  <defs>
    <radialGradient id='clusterGradient'>
      <stop offset='10%' stop-color='red' />
      <stop offset='90%' stop-color='transparent' />
    </radialGradient>
  </defs>
)

function ClusterEvents ({
  projectPoint,
  styleCluster,
  onSelect,
  isRadial,
  svg,
  clusters
}) {
  function calculateTotalPoints () {
    return clusters.reduce((total, cl) => {
      if (cl && cl.properties) {
        total += cl.properties.point_count
      }
      return total
    }, 0)
  }

  function renderClusterBySize (cluster) {
    const { point_count: pointCount, cluster_id: clusterId } = cluster.properties
    const { coordinates } = cluster.geometry
    const [longitude, latitude] = coordinates

    const totalPoints = calculateTotalPoints()

    const styles = {
      fill: isRadial ? "url('#clusterGradient')" : colors.fallbackEventColor,
      stroke: colors.darkBackground,
      strokeWidth: 0,
      fillOpacity: calcClusterOpacity(pointCount, totalPoints)
    }

    return (
      <React.Fragment>
        {<circle
          class='cluster-event-marker'
          id={clusterId}
          longitude={longitude}
          latitude={latitude}
          cx='0'
          cy='0'
          r={calcClusterSize(pointCount, totalPoints)}
          style={styles}
        />}
      </React.Fragment>
    )
  }

  function renderCluster (cluster) {
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
    const { coordinates } = cluster.geometry
    const [longitude, latitude] = coordinates
    if (!latitude || !longitude) return null
    const { x, y } = projectPoint([latitude, longitude])

    const customStyles = styleCluster ? styleCluster(cluster) : null
    const extraRender = () => (
      <React.Fragment>
        {customStyles[1]}
      </React.Fragment>
    )

    return (
      <g
        className={'cluster-event'}
        transform={`translate(${x}, ${y})`}
        onClick={(e) => onSelect(e)}
      >
        {renderClusterBySize(cluster)}
        {extraRender ? extraRender() : null}
      </g>
    )
  }

  return (
    <Portal node={svg}>
      <g className='cluster-locations'>
        {isRadial ? <DefsClusters /> : null}
        {clusters.map(renderCluster)}
      </g>
    </Portal>
  )
}

export default ClusterEvents
