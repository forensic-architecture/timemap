import React from 'react'

const RouteIcon = ({ isEnabled, toggleMapViews }) => {
  return (
    <button
      onClick={() => toggleMapViews('routes')}
    >
      <svg x='0px' y='0px' width='30px' height='20px' viewBox='0 0 30 20' enableBackground='new 0 0 30 20'>
        <path d='M0.806,13.646h7.619c2.762,0,3-0.238,3-3v-0.414c0-2.762,0.301-3,3.246-3h14.523' />
        <polyline points='16.671,9.228 19.103,7.233 16.671,5.237 ' />
      </svg>
    </button>
  )
}

export default RouteIcon
