import React from "react";

const DeselectButton = ({ onSelect }) => {
  return (
    <div>
      <span className="deselect-button" onClick={() => onSelect("")}>
        {"Deselect All"}
      </span>
    </div>
  );
};

export default DeselectButton;
