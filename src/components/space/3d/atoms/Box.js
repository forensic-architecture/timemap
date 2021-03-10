import React, { useRef, useState } from "react";

export default function Box(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const fa_red = "#e41b14";

  // Rotate mesh every frame, this is outside of React without overhead
  // useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))

  return (
    <mesh
      {...props}
      castShadow
      ref={mesh}
      scale={hovered ? [1, 3, 1] : [1, 1, 1]}
      // onClick={(e) => setActive(!active)}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}
    >
      <boxBufferGeometry attach="geometry" args={[0.1, 1, 0.1]} />
      <meshStandardMaterial
        attach="material"
        color={hovered ? fa_red : props.color}
        transparent={true}
      />
    </mesh>
  );
}
