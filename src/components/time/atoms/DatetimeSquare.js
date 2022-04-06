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
  const center = r / 2;
  return (
    <rect
      onClick={onSelect}
      className="event"
      x={x - center}
      y={y}
      style={styleProps}
      width={r}
      height={r}
      transform={transform}
    />
  );
};

export default DatetimeSquare;
