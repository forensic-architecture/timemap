import React, { useState } from "react";

const CardText = ({ title, value, hoverValue = null }) => {
  const [showHover, setShowHover] = useState(false);

  return (
    <div className="card-cell">
      {title ? <h4>{title}</h4> : null}
      <div
        style={{
          width: `fit-content`,
        }}
      >
        <div
          onMouseOver={() => hoverValue && setShowHover(true)}
          onMouseOut={() => hoverValue && setShowHover(false)}
        >
          {showHover ? (
            <span
              style={{
                pointerEvents: `none`,
                opacity: 0.8,
              }}
            >
              <em>{hoverValue}</em>
            </span>
          ) : (
            <div
              style={{
                pointerEvents: `none`,
                display: `inline-block`,
                height: `1.1rem`,
                borderBottom: hoverValue && `1px rgb(235, 68, 62) dashed`,
              }}
            >
              {value}
            </div>
          )}
        </div>
        {/* {!showHover && value} */}
      </div>
    </div>
  );
};

export default CardText;
