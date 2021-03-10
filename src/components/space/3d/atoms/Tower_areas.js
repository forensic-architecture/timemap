import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei/core/useGLTF";
import * as THREE from "three";
import { Html } from "@react-three/drei";

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
  const { nodes, materials } = useGLTF("/Tower_Areas.glb");
  // console.log(nodes["L01"]);
  const meshes = Object.keys(nodes).filter((key) => nodes[key].type === "Mesh");

  let eventLocation = null;
  const selected = props.selected;
  const mask = props.mask;

  const highlighted_events = selected.filter(
    (event, index) => mask[index] === true
  );

  const events_in_location = {};
  meshes.map((meshName) => {
    events_in_location[meshName] = [];
  });

  const highlighted_events_in_location = {};
  meshes.map((meshName) => {
    highlighted_events_in_location[meshName] = [];
  });

  selected.map((selectedEvent) => {
    const locationName = selectedEvent.location.split("-")[0].trim();
    // console.log(locationName, events_in_location[locationName]);
    // breaks on location 000 and off site
    if (events_in_location[locationName]) {
      events_in_location[locationName].push(selectedEvent);
    }
  });

  highlighted_events.map((selectedEvent) => {
    const locationName = selectedEvent.location.split("-")[0].trim();
    // console.log(locationName, events_in_location[locationName]);
    // breaks on location 000 and off site
    if (highlighted_events_in_location[locationName]) {
      highlighted_events_in_location[locationName].push(selectedEvent);
    }
  });

  if (selected.length > 0) {
    const firstSelected = selected[0];
    eventLocation = firstSelected.location.split("-")[0].trim();
  }

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

  // console.log(highlighted_events_in_location);
  const InteractiveMesh = (props) => {
    // const [highlighted, setHighlight] = useState(false);
    const meshName = props.name.meshName; // doens't make sense! should be props.name?
    const events = events_in_location[meshName];
    const highlighted_events = highlighted_events_in_location[meshName];
    const highlighted = highlighted_events_in_location[meshName].length > 0;

    return (
      <group>
        <mesh
          castShadow
          receiveShadow
          // material={getMaterial(eventLocation, meshName)}
          material={highlighted ? highlightedMaterial : interactive_material}
          geometry={nodes[meshName].geometry}
          rotation={nodes[meshName].rotation}
          onClick={() => {
            console.log("mesh seleced", meshName);
            console.log(events_in_location[meshName]);

            props.onMeshSelect(events_in_location[meshName]);
            // console.log(props.selected);
          }}
        />
        <InteractiveMeshLabel
          name={{ meshName }}
          highlighted={highlighted}
          content={highlighted ? highlighted_events : events}
          width={"500px"}
        />
      </group>
    );

    // return (
    //   <group>
    //     <mesh
    //       castShadow
    //       receiveShadow
    //       // material={getMaterial(eventLocation, meshName)}
    //       material={highlighted ? highlightedMaterial : interactive_material}
    //       geometry={nodes[meshName].geometry}
    //       rotation={nodes[meshName].rotation}
    //       onPointerOver={(e) => {
    //         setHighlight(true);
    //         // console.log("mesh hover", meshName);
    //       }}
    //       onPointerOut={(e) => {
    //         setHighlight(false);
    //         // console.log("mesh hover", meshName);
    //       }}
    //       onClick={() => {
    //         console.log("mesh seleced", meshName);
    //         console.log(events_in_location[meshName]);

    //         props.onMeshSelect(events_in_location[meshName]);
    //         // console.log(props.selected);
    //       }}
    //     />
    //     <InteractiveMeshLabel
    //       name={{ meshName }}
    //       highlighted={highlighted}
    //       content={events}
    //       width={"500px"}
    //     />
    //   </group>
    // );
  };

  const getHighlightTag = (event) => {
    return event.associations + " : " + event.type + "--" + event.description;
  };
  const InteractiveMeshLabel = (props) => {
    const highlighted = props.highlighted;
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
                <p style={{ color: "black" }}>{getHighlightTag(event)}</p>
              </div>
            );
          })}
        </div>
      </Html>
    ) : null;
  };

  const myMeshes = meshes.map((meshName, index) => {
    const selected_mesh = events_in_location[meshName].length > 0;

    return selected_mesh ? (
      <group position={nodes[meshName].position}>
        <InteractiveMesh
          name={{ meshName }}
          idx={{ index }}
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

  return <group>{myMeshes}</group>;
}
