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
      y={y}
      style={styleProps}
      width={r}
      height={r}
      transform={transform}
    />
  );
};

export default DatetimeSquare;
