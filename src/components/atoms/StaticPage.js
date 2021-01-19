import React from "react";

const StaticPage = ({ showing, children }) => (
  <div className={`cover-container ${showing ? "showing" : ""}`}>
    {children}
  </div>
);

export default StaticPage;
