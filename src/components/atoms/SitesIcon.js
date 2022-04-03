import React from "react";

const SitesIcon = ({ isActive, isDisabled, onClickHandler }) => {
  let classes = isActive ? "action-button enabled" : "action-button";
  if (isDisabled) {
    classes = "action-button disabled";
  }

  return (
    <button className={classes} onClick={onClickHandler}>
      <i className="material-icons">location_on</i>
    </button>
  );
};

export default SitesIcon;
