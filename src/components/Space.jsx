import React from "react";
import Map from "./Map";
import Space3d from "./Space3d.jsx";

const Space = (props) => {
  switch (props.kind) {
    case "space3d":
      return <Space3d {...props} />;
    default:
      return <Map {...props} />;
  }
};

export default Space;
