import React from "react";

export default ({ x, y, r, transform, onSelect, styleProps, extraRender }) => {
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
