import React, { Component, Suspense } from "react";
import * as THREE from "three";
import { Canvas } from "react-three-fiber";
import { connect } from "react-redux";
import * as selectors from "../../../selectors";

import Controls from "./atoms/Controls";
import Tower from "./atoms/Tower_areas";
import Events from "./atoms/Events";
import Grid from "./atoms/Grid";

class Map3d extends Component {
  renderEvents3D = () => {
    return (
      <Events
        //   svg={this.svgRef.current}
        locations={this.props.domain.locations}
        styleLocation={this.styleLocation}
        categories={this.props.domain.categories}
        projectPoint={this.projectPoint}
        selected={this.props.app.selected}
        narrative={this.props.app.narrative}
        onSelect={this.props.methods.onSelect}
        onMeshSelect={this.props.methods.onMeshSelect}
        onSelectNarrative={this.props.methods.onSelectNarrative}
        getCategoryColor={this.props.methods.getCategoryColor}
      />
    );
  };

  setCamera(selected) {
    // what is this for?
    console.log("outside function");
    return [0, 10, 0];
  }

  getEventsByActor(actorName) {
    // "Behailu Kebede", "Elsa Afeworki", "Alison Moses", "Fatima Alves", "Miguel Alves"
    const events = this.props.domain.events;
    const events_by_actor = events.filter(
      (e) => e.associations[0] === actorName
    );
    console.log(
      "resr",
      events_by_actor.map((e) => e.datetime)
    );
    return events_by_actor;
  }

  getEventsByActorsList(actorsList) {
    // "Behailu Kebede", "Elsa Afeworki", "Alison Moses", "Fatima Alves", "Miguel Alves"
    const events = this.props.domain.events;
    const events_by_actor = events.filter((e) =>
      actorsList.includes(e.associations[0])
    );
    // console.log(
    //   "resr",
    //   events_by_actor.map((e) => e.datetime)
    // );
    return events_by_actor;
  }

  render() {
    const classes = "map-wrapper"; // make this the way it was

    // console.log(this.props.domain.locations);
    const selectedActors = this.getEventsByActorsList([
      "Behailu Kebede",
      "Elsa Afeworki",
      "Alison Moses",
      "Fatima Alves",
      "Miguel Alves",
    ]);
    // console.log(selectedActors);

    const inner3D = (
      <Canvas
        colorManagement={false}
        shadowMap
        gl={{ alpha: false, antialias: true }}
        orthographic
        camera={{ position: [70, 70, 70], fov: 30, zoom: 12, top: 500 }}
        onCreated={({ gl, camera, scene }) => {
          // scene.background = new THREE.Color('#F0F0F0')
          // camera.lookAt(0,0,0)
          gl.setClearColor("#808080");
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.outputEncoding = THREE.sRGBEncoding;
          // camera.lookAt(0, 600, 0);
          console.log(camera.bottom);
          camera.setViewOffset(800, 200, 0, -30, 800, 200);
          // console.log(camera.view);
          // camera.position.x = 20;
          // camera.position.y = 90;
          // camera.position.z = 20;
        }}
      >
        {/* <pointLight position={[-100, 200, -100]} intensity={0.7} /> */}
        <ambientLight intensity={0.4} />
        <directionalLight
          color={"white"}
          intensity={0.7}
          position={[-100, 200, 100]}
          shadow-mapSize-width={5120}
          shadow-mapSize-height={5120}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
          castShadow
        />
        <directionalLight
          color={"white"}
          intensity={0.7}
          position={[100, 200, -100]}
          shadow-mapSize-width={5120}
          shadow-mapSize-height={5120}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
          // castShadow
        />
        {/* <pointLight position={[-50, 500, -60]} intensity={1} color="white" /> */}
        <Grid />
        <Controls selected={this.props.app.selected} />
        <Suspense fallback={null}>
          {/* <Rig> */}
          {/* {this.renderEvents3D()} */}
          <Tower
            // selected={this.props.app.selected}
            selected={selectedActors}
            onMeshSelect={this.props.methods.onMeshSelect}
          />
          {/* </Rig> */}
        </Suspense>
      </Canvas>
    );

    // update to match map!
    return <div className={classes}>{inner3D}</div>;
  }
}

function mapStateToProps(state) {
  return {
    domain: {
      events: selectors.selectStackedEvents(state),
      locations: selectors.selectLocations(state),
      narratives: selectors.selectNarratives(state),
      categories: selectors.getCategories(state),
      sites: selectors.selectSites(state),
      shapes: selectors.selectShapes(state),
    },
    app: {
      views: state.app.associations.views,
      selected: state.app.selected,
      highlighted: state.app.highlighted,
      map: state.app.map,
      narrative: state.app.narrative,
      flags: {
        isShowingSites: state.app.flags.isShowingSites,
      },
    },
    ui: {
      tiles: state.ui.tiles,
      dom: state.ui.dom,
      narratives: state.ui.style.narratives,
      mapSelectedEvents: state.ui.style.selectedEvents,
      shapes: state.ui.style.shapes,
    },
    features: selectors.getFeatures(state),
  };
}

export default connect(mapStateToProps)(Map3d);
