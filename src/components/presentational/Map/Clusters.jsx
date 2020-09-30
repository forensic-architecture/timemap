import React from 'react'
import { Portal } from 'react-portal'
import colors from '../../../common/global.js'
import { calcOpacity, calcClusterSize } from '../../../common/utilities'

function ClusterEvents ({
  projectPoint,
  styleCluster,
  // onSelect,
  svg,
  clusters,
  numClusters,
}) {
  function renderClusterBySize (cluster) {
    const { point_count: pointCount, cluster_id: clusterId } = cluster.properties

    const styles = ({
      fill: colors.fallbackEventColor,
      stroke: colors.darkBackground,
      strokeWidth: 0,
      fillOpacity: calcOpacity(pointCount),
    })

    return (
      <React.Fragment>
        {<circle
          class='cluster-event-marker'
          id={clusterId}
          cx='0'
          cy='0'
          r={calcClusterSize(pointCount, numClusters)}
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
        // onClick={this.props.onSelect}
      >
        {renderClusterBySize(cluster)}
        {extraRender ? extraRender() : null}
      </g>
    )
  }

  return (
    <Portal node={svg}>
      <g className='cluster-locations'>
        {clusters.map(renderCluster)}
      </g>
    </Portal>
  )
}

export default ClusterEvents
