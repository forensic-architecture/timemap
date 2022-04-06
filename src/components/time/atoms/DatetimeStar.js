import React from "react";

function createStar(numPoints, r, x, y) {
  const innerRadius = r;
  const outerRadius = (r * 2) / numPoints;
  const angle = Math.PI / numPoints;
  const points = [];

  for (let i = 0; i < numPoints * 2; i++) {
    const radius = i & 1 ? innerRadius : outerRadius;
    points.push(radius * Math.sin(i * angle) + x);
    points.push(radius * Math.cos(i * angle) + y);
  }

  return points;
}

const DatetimeStar = ({ x, y, r, onSelect, styleProps, extraRender }) => {
  return (
    <polygon
      onClick={onSelect}
      className="event"
      x={x}
      y={y}
      style={styleProps}
      points={createStar(5, r, x, y)}
    />
  );
};

export default DatetimeStar;
