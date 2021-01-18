import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import React, { useRef } from "react";
import { extend, useThree, useFrame } from "react-three-fiber";

extend({ OrbitControls });

const Controls = (props) => {
  const {
    camera,
    gl: { domElement },
  } = useThree();
  const controls = useRef();
  const selected = props.selected;

  useFrame(() => controls.current && controls.current.update());
  if (controls.current) {
    if (selected.length > 0) {
      const firstSelected = selected[0];
      controls.current.target.x = parseInt(firstSelected.latitude);
      controls.current.target.y = 7; // for now
      controls.current.target.z = parseInt(firstSelected.longitude);
      // console.log( 'box position:', [firstSelected.latitude, 0, firstSelected.longitude]);
    }
  }
  return (
    <orbitControls ref={controls} args={[camera, domElement]} {...props} />
  );
};

export default Controls;

// https://github.com/react-spring/react-three-fiber/issues/27
// https://codesandbox.io/s/react-three-fiber-orbitcontrols-gg67g?file=/src/index.js:593-603
