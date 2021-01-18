import React, { useRef } from "react";

export default function Cell(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef();

  // Set up state for the hovered and active state

  // Rotate mesh every frame, this is outside of React without overhead
  // useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))

  return (
    <mesh {...props}>
      <boxBufferGeometry attach="geometry" args={[50, 0.05, 50]} />
      <meshStandardMaterial attach="material" color={"grey"} />
    </mesh>
  );
}
