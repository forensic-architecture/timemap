import React from 'react'
import { Portal } from 'react-portal'
import colors from '../../../common/global.js'
import { calcOpacity } from '../../../common/utilities'

function ClusterEvents ({
  projectPoint,
  styleCluster,
  onSelect,
  svg,
  clusters,
  radius
}) {
  function renderClusterBySize (cluster) {

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
        onClick={this.props.onSelect}
      >
        {renderClusterBySize(cluster)}
        {extraRender ? extraRender() : null}
      </g>
    )
  }

  return (
    <Portal node={svg}>
      <g className='clusters'>
        {clusters.map(renderCluster)}
      </g>
    </Portal>
  )
}

export default ClusterEvents
