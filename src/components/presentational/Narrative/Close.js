import React from "react";

const Close = ({ onClickHandler, closeMsg }) => {
  return (
    <div className="narrative-close" onClick={onClickHandler}>
      <button className="side-menu-burg is-active">
        <span />
      </button>
      <div className="close-text">{closeMsg}</div>
    </div>
  );
};

export default Close;
