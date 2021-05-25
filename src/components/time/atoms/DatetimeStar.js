import React from "react";

const DatetimeStar = ({
  x,
  y,
  r,
  transform,
  onSelect,
  styleProps,
  extraRender,
}) => {
  const s = (r * 2) / 3;
  return (
    <polygon
      onClick={onSelect}
      className="event"
      x={x}
      y={y}
      style={styleProps}
      points={`${x + s},${y - s} ${x - r},${y} ${x + r},${y} ${x - s},${
        y - s
      } ${x},${y + s}`}
      transform={transform}
    />
  );
};

export default DatetimeStar;
