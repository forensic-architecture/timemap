import React from 'react'

const TimelineHeader = ({ title, date0, date1, onClick, hideInfo }) => (
  <div className='timeline-header'>
    <div className='timeline-toggle' onClick={() => onClick()}>
      <p><i className='arrow-down' /></p>
    </div>
    <div className={`timeline-info ${hideInfo ? 'hidden' : ''}`}>
      <p>{title}</p>
      <p>{date0} - {date1}</p>
    </div>
  </div>
)

export default TimelineHeader
