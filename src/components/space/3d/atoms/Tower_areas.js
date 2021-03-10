import React, { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei/useGLTF";
import * as THREE from "three";
import ResponsiveText from "./ResponsiveText";
import { Html } from "@react-three/drei";
import { prop } from "ramda";

export default function Model(props) {
  const createMaterial = (color, opacity) => {
    return new THREE.MeshPhongMaterial({
      color: color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: opacity,
      // wireframe: true,
    });
  };

  const createEdgeMaterial = (color) => {
    return new THREE.LineBasicMaterial({
      color: color,
      // side: THREE.DoubleSide,
    });
  };

  const fa_red = "#e41b14";
  let interactive_material = createMaterial(fa_red, 0.3);
  let highlightedMaterial = createMaterial(fa_red, 0.9);

  const group = useRef();
  const { nodes, materials } = useGLTF("/Grenfell Tower Selection Areas.glb");
  // console.log(nodes["L01"]);
  const meshes = Object.keys(nodes).filter((key) => nodes[key].type === "Mesh");

  let eventLocation = null;
  const selected = props.selected;

  const events_in_location = {};
  meshes.map((meshName) => {
    events_in_location[meshName] = [];
  });
  selected.map((selectedEvent) => {
    const locationName = selectedEvent.location.split("-")[0].trim();
    // console.log(locationName, events_in_location[locationName]);
    // breaks on location 000 and off site
    if (events_in_location[locationName]) {
      events_in_location[locationName].push(selectedEvent);
    }
  });

  if (selected.length > 0) {
    const firstSelected = selected[0];
    eventLocation = firstSelected.location.split("-")[0].trim();
  }

  const not_selected_material = createMaterial("white", 1);

  const getMaterial = (eventLocation, meshName) => {
    const white_material = createMaterial("white", 1);
    white_material.transparent = true;
    if (eventLocation === "Off site" || eventLocation === null) {
      white_material.opacity = 1;
      return white_material;
    } else {
      const Iam_selected = events_in_location[meshName].length > 0;
      if (Iam_selected) {
        interactive_material.transparent = true;
        interactive_material.opacity = 0.6;
        return interactive_material;
      } else {
        white_material.opacity = 0.15;
        return white_material;
      }
    }
  };

  const InteractiveMesh = (props) => {
    const [highlighted, setHighlight] = useState(false);
    const meshName = props.name.meshName; // doens't make sense! should be props.name?
    const events = events_in_location[meshName];
    return (
      <group>
        <mesh
          castShadow
          receiveShadow
          // material={getMaterial(eventLocation, meshName)}
          material={highlighted ? highlightedMaterial : interactive_material}
          geometry={nodes[meshName].geometry}
          rotation={nodes[meshName].rotation}
          onPointerOver={(e) => {
            setHighlight(true);
            // console.log("mesh hover", meshName);
          }}
          onPointerOut={(e) => {
            setHighlight(false);
            // console.log("mesh hover", meshName);
          }}
          onClick={() => {
            console.log("mesh seleced", meshName);
            console.log(events_in_location[meshName]);

            props.onMeshSelect(events_in_location[meshName]);
            // console.log(props.selected);
          }}
        />
        {/* {highlighted ? (
          events.map((event) => {
            return (
              <InteractiveMeshLabel
                name={{ meshName }}
                highlighted={highlighted}
                content={"- " + event.description}
                width={"500px"}
              />
            );
          })
        ) : (
          <InteractiveMeshLabel
            name={{ meshName }}
            highlighted={highlighted}
            content={events_in_location[meshName].length}
            width={"auto"}
          />
        )} */}
        <InteractiveMeshLabel
          name={{ meshName }}
          highlighted={highlighted}
          content={events}
          width={"500px"}
        />
      </group>
    );
  };

  const InteractiveMeshLabel = (props) => {
    const meshName = props.name.meshName;
    const highlighted = props.highlighted;
    const width = props.width;
    const events = props.content;
    const style = {
      background: "white",
      paddingLeft: "3px",
      paddingRight: "3px",
      borderRadius: "5px",
      width: highlighted ? "300px" : "auto",
      margin: "1px",
    };

    return highlighted ? (
      <Html>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {events.map((event) => {
            return (
              <div style={style}>
                <p style={{ color: "black" }}>{event.description}</p>
              </div>
            );
          })}
        </div>
      </Html>
    ) : (
      <Html>
        <div style={style}>
          <p style={{ color: "black" }}>{events.length}</p>
        </div>
      </Html>
    );
  };

  const myMeshes = meshes.map((meshName) => {
    const selected_mesh = events_in_location[meshName].length > 0;

    return selected_mesh ? (
      <group position={nodes[meshName].position}>
        <InteractiveMesh
          name={{ meshName }}
          onMeshSelect={props.onMeshSelect}
        />

        {/* <lineSegments>
          <edgesGeometry
            attach={nodes[meshName].geometry}
            args={[nodes[meshName].geometry]}
          />
          <lineBasicMaterial material={createEdgeMaterial("blue")} />
        </lineSegments> */}
      </group>
    ) : (
      <mesh
        castShadow
        receiveShadow
        material={getMaterial(eventLocation, meshName)}
        // material={materials[nodes[meshName].material.name]}
        geometry={nodes[meshName].geometry}
        position={nodes[meshName].position}
        rotation={nodes[meshName].rotation}
      />
    );
  });

  function addTag(locationName) {
    if (locationName !== null && locationName !== "Off site") {
      console.log(locationName);
      return (
        // <ResponsiveText
        //   content={"testrrrrrrrrr"}
        //   position={nodes[locationName].position}
        //   lookAt={[10, 0, 0]}
        // />
        <Html></Html>
      );
    } else {
      return null;
    }
  }

  return (
    <group>
      {/* <mesh
        visible={true}
        material={materials[nodes.Mesh000.material.name]}
        geometry={nodes.Mesh000.geometry}
      /> */}

      {myMeshes}
    </group>
  );
}
