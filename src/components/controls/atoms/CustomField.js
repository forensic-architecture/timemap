import React from "react";
import marked from "marked";

// TODO could this be a security vulnerability?
const CardCustomField = ({ title, value }) => (
  <div className="card-cell">
    {title ? <h4>{title}</h4> : null}
    <div dangerouslySetInnerHTML={{ __html: marked(`${value}`) }} />
  </div>
);

export default CardCustomField;
