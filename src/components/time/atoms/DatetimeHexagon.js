import React from "react";

const DatetimeHexagon = ({ x, y, r, transform, onSelect, styleProps }) => {
  const s = (r * 2) / 3;
  return (
    <polygon
      onClick={onSelect}
      className="event"
      x={x}
      y={y}
      style={styleProps}
      points={`${x + s - 2},${y + s} ${x + s + 2},${y} ${x + s - 2},${y - s} ${
        x - s + 2
      },${y - s} ${x - s - 2},${y} ${x - s + 2},${y + s}`}
    />
  );
};

export default DatetimeHexagon;
