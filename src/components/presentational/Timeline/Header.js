import React from 'react'

const TimelineHeader = ({ title, from, to, onClick, hideInfo }) => {
  const d0 = from && from.toLocaleDateString()
  const d1 = to && to.toLocaleDateString()
  return (
    <div className='timeline-header'>
      <div className='timeline-toggle' onClick={() => onClick()}>
        <p><i className='arrow-down' /></p>
      </div>
      <div className={`timeline-info ${hideInfo ? 'hidden' : ''}`}>
        <p>{title}</p>
        <p>{d0} - {d1}</p>
      </div>
    </div>
  )
}

export default TimelineHeader
