import React from 'react'
import { makeNiceDate } from '../../../common/utilities'

const TimelineHeader = ({ title, from, to, onClick, hideInfo }) => {
  const d0 = from && makeNiceDate(from)
  const d1 = to && makeNiceDate(to)
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
