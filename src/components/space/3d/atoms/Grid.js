import React, { useRef } from "react";
import Cell from "./GridCell";

export default function Grid(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef();

  // Rotate mesh every frame, this is outside of React without overhead
  // useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))

  function simpleBox() {
    // not working, don't know why
    return (
      <mesh {...props} ref={mesh}>
        <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
        {/* <MeshStandardMaterial attach='material' color={? 'brown' : props.color} /> */}
      </mesh>
    );
  }

  let positions = [];
  for (let i = 0; i < 1; i++) {
    for (let j = 0; j < 1; j++) {
      positions.push([i, 6.2, j]);
    }
  }

  return positions.map((position) => {
    return <Cell position={position} />;
  });
}
