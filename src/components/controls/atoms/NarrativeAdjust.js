import React from "react";

const Adjust = ({ isDisabled, direction, onClickHandler }) => {
  return (
    <div
      className={`narrative-adjust ${direction}`}
      onClick={!isDisabled ? onClickHandler : null}
    >
      <i className={`material-icons ${isDisabled ? "disabled" : ""}`}>
        {`chevron_${direction}`}
      </i>
    </div>
  );
};

export default Adjust;
