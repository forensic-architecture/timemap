import React from "react";

const Checkbox = ({ label, isActive, onClickCheckbox, color, styleProps }) => {
  return (
    <div className={isActive ? "item active" : "item"}>
      <span style={{ color: color }}>{label}</span>
      <button onClick={onClickCheckbox}>
        <div className="border">
          <div className="checkbox" style={styleProps} />
        </div>
      </button>
    </div>
  );
};

export default Checkbox;
