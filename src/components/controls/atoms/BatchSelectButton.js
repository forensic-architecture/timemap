import React from "react";

const BatchSelectButtons = ({ onSelect, onDeselect }) => {
  return (
    <div className="select-buttons">
      <span className="batch-select-button" onClick={onSelect}>
        {"Select All"}
      </span>
      <span className="batch-select-button" onClick={onDeselect}>
        {"Deselect All"}
      </span>
    </div>
  );
};

export default BatchSelectButtons;
