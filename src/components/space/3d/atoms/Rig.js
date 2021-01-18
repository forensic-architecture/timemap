import React, { useRef } from "react";
import { useFrame } from "react-three-fiber";
import lerp from "lerp";

function Rig({ children }) {
  const outer = useRef();
  const inner = useRef();
  useFrame(({ clock }) => {
    outer.current.position.y = lerp(outer.current.position.y, 0, 0.05);
    inner.current.rotation.y = Math.sin(clock.getElapsedTime() / 8) * Math.PI;
    inner.current.position.z = 5 + -Math.sin(clock.getElapsedTime() / 2) * 2;
    // inner.current.position.y = -5 + Math.sin(clock.getElapsedTime() / 2) * 2
  });
  return (
    <group position={[0, -100, 0]} ref={outer}>
      <group ref={inner}>{children}</group>
    </group>
  );
}

export default Rig;
