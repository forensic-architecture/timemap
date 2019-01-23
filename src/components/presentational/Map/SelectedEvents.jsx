import React from 'react'
import { Portal } from 'react-portal'

class MapSelectedEvents extends React.Component {
  renderMarker (event) {
    const { x, y } = this.props.projectPoint([event.latitude, event.longitude])
    return (
      <g
        className='location-marker'
        transform={`translate(${x - 32}, ${y})`}
      >
        <path
          className='leaflet-interactive'
          stroke='#ffffff'
          stroke-opacity='1'
          stroke-width='3'
          stroke-linecap=''
          stroke-linejoin='round'
          stroke-dasharray='5,2'
          fill='none'
          d='M0,0a32,32 0 1,0 64,0 a32,32 0 1,0 -64,0 '
        />
      </g>
    )
  }

  render () {
    return (
      <Portal node={this.props.svg}>
        {this.props.selected.map(s => this.renderMarker(s))}
      </Portal>
    )
  }
}
export default MapSelectedEvents
