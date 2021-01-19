import React from "react";
import MapCarto from "./carto/Map";
// import Map3d from "./3d/Map";

const Space = (props) => {
  switch (props.kind) {
    // case "3d":
    //   return <Map3d {...props} />;
    default:
      return <MapCarto {...props} />;
  }
};

export default Space;
