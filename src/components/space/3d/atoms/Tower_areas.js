import React, { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei/core/useGLTF";
import * as THREE from "three";
import { Html, Line } from "@react-three/drei";
import { F } from "ramda";

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
  const meshes = Object.keys(nodes).filter((key) => nodes[key].type === "Mesh");

  const mapLocationsToMeshes = (fullLocationName) => {
    // fullLocationName example :
    // locationName as it comes from ds-s
    // meshName as it comes in the model
    const locationName = fullLocationName.split("-")[0].trim();
    const secondaryLocationName = fullLocationName.split("-")[1].trim();
    if (locationName === "Off site") {
      return "Off_site";
    }
    if (locationName === "000") {
      // console.log(secondaryLocationName);
      if (secondaryLocationName === "W Elevation") {
        return "00W";
      }

      if (secondaryLocationName === "E Elevation") {
        return "00E";
      }

      if (secondaryLocationName === "N Elevation") {
        return "00N";
      }

      // includes Entrance, General, FD, S Elevation
      return "00S";
    }

    return locationName;
  };

  let eventLocation = null;
  const selected = props.selected;

  const getEventsByActorDict = (eventsList) => {
    const eventsByActor = {};
    eventsList.map((e) => {
      const actorName = e.associations[0];
      if (Object.keys(eventsByActor).includes(actorName)) {
        eventsByActor[actorName].push(e);
      } else {
        eventsByActor[actorName] = [];
        eventsByActor[actorName].push(e);
      }
    });

    return eventsByActor;
  };

  const locationsByFloors = {
    0: {
      access: ["LBO", "LF0"],
      lobby: "LB0",
      spaces: ["L0E", "CRO", "LB0", "LF0", "S0E", "00S", "00E"],
    },
    4: {
      access: ["LF4", "S04"],
      lobby: "L04",
      spaces: ["011", "012", "013", "014", "015", "016", "L04", "LF4", "S04"],
    },
    13: {
      access: ["LF13", "S31"], // S31 needs to be fixed!!
      lobby: "L13",
      spaces: ["101", "102", "103", "104", "105", "106", "L13", "LF13", "S31"],
    },
  };

  const floorByLocaiton = () => {
    const locations = {};
    const floors = Object.keys(locationsByFloors);
    floors.map((floorNum) => {
      const spaces = locationsByFloors[floorNum].spaces;
      spaces.map((space) => {
        locations[space] = floorNum;
      });
    });
    return locations;
  };

  const isLobby = (meshName) => {
    const meshFloor = floorByLocaiton()[meshName];
    // console.log(meshName, meshFloor, locationsByFloors[meshFloor]);
    const floorLobby = locationsByFloors[meshFloor].lobby;

    return meshName === floorLobby;
  };

  const getLobby = (meshName) => {
    const meshFloor = floorByLocaiton()[meshName];
    const floorLobby = locationsByFloors[meshFloor].lobby;
    return floorLobby;
  };

  const getMeshPosition = (meshName) => {
    return nodes[meshName].position;
  };

  const getActorPath = (eventsList) => {
    // takes a list of events for one actor
    // for every event we want to find its mesh in the 3d
    // then find the position of that mesh

    const realPathNames = [];
    for (let i = 0; i < eventsList.length - 1; i++) {
      const event1 = eventsList[i];
      const event2 = eventsList[i + 1];
      const meshName1 = mapLocationsToMeshes(event1.location);
      const meshName2 = mapLocationsToMeshes(event2.location);

      // console.log(meshName1)

      isLobby(meshName1)
        ? realPathNames.push(meshName1)
        : realPathNames.push(meshName1) &&
          realPathNames.push(getLobby(meshName1));

      isLobby(meshName2)
        ? realPathNames.push(meshName2)
        : realPathNames.push(getLobby(meshName2)) &&
          realPathNames.push(meshName2);
    }

    const realPathPoints = realPathNames.map((meshName) =>
      getMeshPosition(meshName)
    );

    console.log(realPathNames);
    const directPathPoints = [];
    eventsList.map((e) => {
      const meshName = mapLocationsToMeshes(e.location);
      const position = nodes[meshName].position;

      directPathPoints.push(position);
    });

    // console.log(nodes["L01"].geometry.boundingBox);
    // return a list of [x, y, z] positions
    const randomeList = [
      [Math.random() * 10, 0, 0],
      [0, Math.random() * 10, 0],
      [0, Math.random() * 40, 10],
    ];
    return realPathPoints; // directPathPoints; realPathPoints
  };

  const colorByActor = {
    "Behailu Kebede": "red",
    "Elsa Afeworki": "blue",
    "Fatima Alves": "brown",
    "Alison Moses": "green",
    "Miguel Alves": "orange",
  };

  const draw3dPath = (pointsList, color) => {
    // takes a point list with the format of [x, y, z]
    const wiggle = Math.random();
    console.log(wiggle);
    const movedPoints = pointsList.map((point) => [
      point.x + wiggle,
      point.y,
      point.z + wiggle,
    ]);

    console.log(pointsList);
    console.log(movedPoints);
    // returns react-three-fiber <Line/>
    return (
      <Line points={movedPoints} color={color} lineWidth={1} dashed={false} />
    );
  };

  const events_in_location = {};
  meshes.map((meshName) => {
    events_in_location[meshName] = [];
  });
  selected.map((selectedEvent) => {
    const locationName = mapLocationsToMeshes(selectedEvent.location);
    // console.log(locationName, events_in_location[locationName]);
    if (events_in_location[locationName]) {
      events_in_location[locationName].push(selectedEvent);
    }
  });

  if (selected.length > 0) {
    const firstSelected = selected[0];
    eventLocation = mapLocationsToMeshes(firstSelected.location);
  }

  const getMaterial = (eventLocation, meshName) => {
    const white_material = createMaterial("white", 1);
    white_material.transparent = true;
    if (eventLocation === null) {
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

  const getHighlightTag = (event) => {
    const time = new Date(event.datetime).toLocaleTimeString("en-US");
    let tag = time + " :: " + event.associations + " : " + event.type;

    if (event.type === "Present") {
      tag =
        time +
        " :: " +
        event.associations +
        " is " +
        event.type +
        " at " +
        event.location;
    }
    if (event.type === "Non-actor") {
      tag = time + " :: " + event.associations;
      console.log(event);
    }
    if (event.type === "Arrival" || event.type === "Departure") {
      tag =
        time +
        " :: " +
        event.type +
        " of " +
        event.associations +
        " at " +
        event.location;
    }
    return tag;
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
      width: highlighted ? "250px" : "auto",
      margin: "1px",
    };

    const getGroupedTags = (events) => {
      // create a dictionary by event types
      const event_types_dict = {};
      events.map((event) => {
        const event_type = event.type;
        if (Object.keys(event_types_dict).includes(event_type)) {
          event_types_dict[event_type].push(event);
        } else {
          event_types_dict[event_type] = [];
          event_types_dict[event_type].push(event);
        }
      });
      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }

      const tags = [];
      Object.keys(event_types_dict).map((eventTypeKey) => {
        const eventsList = event_types_dict[eventTypeKey];
        const names = eventsList.map((event) => event.associations[0]);
        const unique_names = names.filter(onlyUnique); // we shouldn't need to do that! clear dups beforehand
        let tag = eventTypeKey.toUpperCase() + " ::: " + unique_names;
        // if (eventTypeKey === "Present") {
        //   let desc = " IS PRESENT";
        //   names.length > 1 ? (desc = " ARE PRESENT") : (desc = " IS PRESENT");
        //   tag = names + desc;
        // }

        tags.push(tag);
      });
      return tags;
    };

    return highlighted ? (
      <Html>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* {getGroupedTags(events).map((event) => {
            return (
              <div style={style}>
                <p style={{ color: "black" }}>{event}</p>
              </div>
            );
          })} */}

          {events.map((event) => {
            return (
              <div style={style}>
                <p style={{ color: "black" }}>{getHighlightTag(event)}</p>
                <p style={{ color: "black", fontSize: "12px" }}>
                  {event.description}
                </p>
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
      <group position={nodes[meshName].position} scale={nodes[meshName].scale}>
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
        scale={nodes[meshName].scale}
      />
    );
  });

  const actorsDict = getEventsByActorDict(selected);
  const actorsNames = Object.keys(actorsDict);
  const myLines = actorsNames.map((name, i) => {
    const pointsByActor = getActorPath(actorsDict[name]);
    return draw3dPath(pointsByActor, colorByActor[name]);
  });

  return (
    <group>
      {myMeshes}
      {myLines}
    </group>
  );
}
