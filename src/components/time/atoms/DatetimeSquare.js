import React from "react";

const DatetimeSquare = ({
  x,
  y,
  r,
  transform,
  onSelect,
  styleProps,
  extraRender,
}) => {
  return (
    <rect
      onClick={onSelect}
      className="event"
      x={x}
      y={y - r}
      style={styleProps}
      width={r}
      height={r}
      transform={`rotate(45, ${x}, ${y})`}
    />
  );
};

export default DatetimeSquare;
