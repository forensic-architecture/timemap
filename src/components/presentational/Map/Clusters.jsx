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
    const { point_count, cluster_id } = cluster.properties

    const size = calcClusterSize(point_count, numClusters)

    const width = `${size}px`
    const height = `${size}px`

    const styles = ({
      fill: 'blue',
      stroke: colors.darkBackground,
      strokeWidth: 0,
      fillOpacity: calcOpacity(point_count),
      width,
      height
    })

    return (
      <React.Fragment>
        <path
          class='cluster-event-marker'
          id={cluster_id}
          d="M 8 0 A 8 8 0 1 1 8 -1.959434878635765e-15 L 0 0  L 8 0 Z"
          style={styles}
        />
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
