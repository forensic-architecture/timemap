import React from "react";
import { useThree } from "react-three-fiber";

function moveCamera({ selected }) {
  // locations.map(l => console.log( "----", getCategoryColor(l.category)) )
  const { camera, setDefaultCamera } = useThree();

  // we already have selected..
  let x = 10; // offset values
  let y = 10;
  let z = 10;

  // return (event) => onSelect(location.events);
  if (selected.length > 0) {
    console.log("selected", selected);
    let eventsToSelect = selected; // .map(event => this.getEventById(event.id))
    // eventsToSelect = eventsToSelect.sort((a, b) => parseDate(a.timestamp) - parseDate(b.timestamp))

    const firstSelected = eventsToSelect[0];
    console.log(firstSelected);

    x += parseInt(firstSelected.latitude);
    y += 0; // for now
    z += parseInt(firstSelected.longitude);
    console.log("box position:", [
      firstSelected.latitude,
      0,
      firstSelected.longitude,
    ]);
  }

  camera.position.x = x;
  camera.position.y = y;
  camera.position.z = z;
  camera.lookAt(x, y, z);

  console.log("camera :", camera);
  return camera;
}

export default moveCamera;
