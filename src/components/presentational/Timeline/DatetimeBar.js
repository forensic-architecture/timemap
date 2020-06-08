import React from 'react'

export default ({
  highlights,
  events,
  x,
  y,
  width,
  height,
  onSelect,
  styleProps,
  extraRender
}) => {
  if (highlights.length === 0) {
    return (
      <rect
        onClick={onSelect}
        className='event'
        x={x}
        y={y}
        style={styleProps}
        width={width}
        height={height}
      />
    )
  }
  const sectionHeight = height / highlights.length
  return (
    <React.Fragment>
      {highlights.map((h, idx) => (
        <rect
          onClick={onSelect}
          className='event'
          x={x}
          y={y - sectionHeight + (idx * sectionHeight) + (sectionHeight / 2)}
          style={{ ...styleProps, opacity: h ? 0.3 : 0.1 }}
          width={width}
          height={sectionHeight}
        />
      ))}
    </React.Fragment>
  )
}
