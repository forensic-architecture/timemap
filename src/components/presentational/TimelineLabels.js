import React from 'react'

const TimelineLabels = ({ dims, timelabels }) => {
  return (
    <g>
      <line
        class='axisBoundaries'
        x1={dims.margin_left}
        x2={dims.margin_left}
        y1='10'
        y2='20'
      />
      <line
        class='axisBoundaries'
        x1={dims.width - dims.width_controls}
        x2={dims.width - dims.width_controls}
        y1='10'
        y2='20'
      />
      {/* <text */}
      {/*   class="timeLabel0 timeLabel" */}
      {/*   x="5" */}
      {/*   y="15" */}
      {/* > */}
      {/*   {formatterWithYear(timelabels[0])} */}
      {/* </text> */}
      {/* <text */}
      {/*   class="timelabelF timeLabel" */}
      {/*   x={dims.width - dims.width_controls - 5} */}
      {/*   y="15" */}
      {/*   style={{ textAnchor: 'end' }} */}
      {/* > */}
      {/*   {formatterWithYear(timelabels[1])} */}
      {/* </text> */}
    </g>
  )
}

export default TimelineLabels
