import React from 'react'

const TimelineClip = ({ dims }) => (
  <clipPath id='clip'>
    <rect
      x={dims.marginLeft}
      y='0'
      width={dims.width - dims.marginLeft - dims.width_controls}
      height={dims.contentHeight}
    />
  </clipPath>
)

export default TimelineClip
