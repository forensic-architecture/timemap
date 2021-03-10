import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import React, { useRef } from "react";
import { extend, useThree, useFrame } from "react-three-fiber";

extend({ OrbitControls });

const Controls = (props) => {
  const {
    camera,
    gl: { domElement },
  } = useThree();

  // console.log("Camera Position: ", camera.position);
  // console.log("Camera LookAt: ", camera.lookAt);
  const controls = useRef();
  const selected = props.selected;

  useFrame(() => controls.current && controls.current.update());
  // if (controls.current) {
  //   if (selected.length > 0) {
  //     const firstSelected = selected[0];
  //     const eventLocation = firstSelected.location.split("-")[0].trim();
  //     const loc = locations_xyz[eventLocation];
  //     console.log(loc);
  //     console.log("selected event location is ", eventLocation);
  //     controls.current.target.x = loc[0]; //parseInt(firstSelected.latitude);
  //     controls.current.target.y = loc[1]; // for now
  //     controls.current.target.z = loc[2]; //parseInt(firstSelected.longitude);
  //     // console.log( 'box position:', [firstSelected.latitude, 0, firstSelected.longitude]);
  //     camera.position.x = loc[0] + 50;
  //     camera.position.y = loc[1] + 50;
  //     camera.position.z = loc[2] + 50;
  //   }
  // }
  return (
    <orbitControls ref={controls} args={[camera, domElement]} {...props} />
  );
};

export default Controls;

// https://github.com/react-spring/react-three-fiber/issues/27
// https://codesandbox.io/s/react-three-fiber-orbitcontrols-gg67g?file=/src/index.js:593-603
