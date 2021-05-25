import React from "react";

const DatetimeTriangle = ({ x, y, r, transform, onSelect, styleProps }) => {
  const s = (r * 2) / 3;
  return (
    <polygon
      onClick={onSelect}
      className="event"
      x={x}
      y={y}
      style={styleProps}
      points={`${x},${y + s} ${x + s},${y - s} ${x - s},${y - s}`}
      transform={`rotate(180, ${x}, ${y})`}
    />
  );
};

export default DatetimeTriangle;
