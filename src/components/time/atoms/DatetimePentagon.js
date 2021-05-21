import React from "react";

const DatetimePentagon = ({ x, y, r, transform, onSelect, styleProps }) => {
  const s = (r * 2) / 3;
  return (
    <polygon
      onClick={onSelect}
      className="event"
      x={x}
      y={y}
      style={styleProps}
      points={`${x},${y + s} ${x + s},${y} ${x + s},${y - s} ${x - s},${
        y - s
      } ${x - s},${y}`}
      transform={`rotate(180, ${x}, ${y})`}
    />
  );
};

export default DatetimePentagon;
