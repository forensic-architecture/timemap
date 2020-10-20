import React from 'react'
import Calendar from 'react-calendar'

const TimelineCalendar = ({ onSelect, activeStartDate, maxDate, minDate, timeRange }) => {
  return (
    <div className='calendar'>
      <Calendar
        onChange={onSelect}
        value={timeRange}
        calendarType="US"
        maxDate={new Date(maxDate)}
        minDate={new Date(minDate)}
        activeStartDate={activeStartDate}
      />
    </div>
  )
}


export default TimelineCalendar