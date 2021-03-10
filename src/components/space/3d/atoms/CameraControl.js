import * as THREE from "three";
import { useFrame, useThree } from "react-three-fiber";

function CameraControl(props) {
  const { camera, setDefaultCamera } = useThree();

  const selected = props.selected;

  let x = 10; // offset values
  let y = 10;
  let z = 10;

  // return (event) => onSelect(location.events);
  if (selected.length > 0) {
    // console.log('selected', selected);
    let eventsToSelect = selected; // .map(event => this.getEventById(event.id))
    // eventsToSelect = eventsToSelect.sort((a, b) => parseDate(a.timestamp) - parseDate(b.timestamp))

    const firstSelected = eventsToSelect[0];
    // console.log(firstSelected);

    x = 0; //parseInt(firstSelected.latitude);
    y = 7; // for now
    z = 0; //parseInt(firstSelected.longitude);
    // console.log( 'box position:', [firstSelected.latitude, 0, firstSelected.longitude]);
  }

  camera.lookAt([x, y, z]);
  const r = 30; // distance from target
  // camera.translate(0, 0, 10);

  // calculating the new camera position
  const targetPos = new THREE.Vector3(x, y, z);
  const currentPos = new THREE.Vector3(
    camera.position.x,
    camera.position.y,
    camera.position.z
  );
  const subVec = currentPos.sub(targetPos);
  const moveVec = targetPos.add(subVec.setLength(r));

  camera.position.x = moveVec.x;
  camera.position.y = moveVec.y;
  camera.position.z = moveVec.z;

  // Camera Rotation
  useFrame(({ clock }) => {
    // add a better movement !!
    camera.position.x += 0.01;
    camera.position.y += 0.01;
  });

  return null;
}

export default CameraControl; // Model
