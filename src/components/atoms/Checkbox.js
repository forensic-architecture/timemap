import React from "react";

const Checkbox = ({ label, isActive, onClickCheckbox, color, styleProps }) => {
  return (
    <div className={isActive ? "item active" : "item"}>
      <span style={{ color: color }}>{label}</span>
      <button onClick={onClickCheckbox}>
        <div className="border" style={styleProps.containerStyles}>
          <div className="checkbox" style={styleProps.checkboxStyles} />
        </div>
      </button>
    </div>
  );
};

export default Checkbox;
