import React, { Component, Suspense } from "react";
import * as THREE from "three";
import { Canvas } from "react-three-fiber";
import { connect } from "react-redux";
import * as selectors from "../../../selectors";

import Controls from "./atoms/Controls";
// import Tower from './atoms/Tower';
// import Context from './atoms/CONTEXT';
import Events from "./atoms/Events";
import Grid from "./atoms/Grid";
import Model from "./atoms/CameraControl";

class Map3d extends Component {
  renderEvents3D(locations) {
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
        onSelectNarrative={this.props.methods.onSelectNarrative}
        getCategoryColor={this.props.methods.getCategoryColor}
      />
    );
  }

  setCamera(selected) {
    // what is this for?
    console.log("outside function");
    return [0, 10, 0];
  }

  getTower(selected) {
    // const myCustomMaterial = new THREE.MeshLambertMaterial({ color: 'green' });
    // const tower = <Tower material={myCustomMaterial} selected={selected} />
    // return tower
    return null;
  }

  render() {
    const classes = "map-wrapper"; // make this the way it was

    const inner3D = (
      <Canvas
        colorManagement
        gl={{ alpha: false, antialias: true, logarithmicDepthBuffer: true }}
        camera={{ position: [50, 250, 130], fov: 30 }}
        onCreated={({ gl, camera, scene }) => {
          // scene.background = new THREE.Color('#F0F0F0')
          // camera.lookAt(0,0,0)
          gl.setClearColor("white");
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.outputEncoding = THREE.sRGBEncoding;
          camera.position.x = 150;
          camera.position.y = 250;
          camera.position.z = 150;
        }}
      >
        {/* <perspectiveCamera  position={this.setCamera(this.props.app.selected)} name="Camera_Orientation" rotation={[-1.5707962925663537, 0, 0]} /> */}
        <ambientLight intensity={1.1} color="#404040" />
        {/* <spotLight position={[50, 230, 60]} /> */}
        <pointLight position={[50, 230, 60]} intensity={1.8} />
        <pointLight
          position={[-50, 230, -60]}
          intensity={2.2}
          color="#f0eee6"
        />
        <Grid />
        {/* <ResponsiveText content={ 'hi'} position={[1, 1, 0]}/> */}
        <Controls selected={this.props.app.selected} />
        <Suspense fallback={null}>
          {/* <Rig> */}
          <Model selected={this.props.app.selected} />
          {this.renderEvents3D(this.props.domain.locations)}
          {this.getTower(this.props.app.selected)}
          {/* <Tower/> */}
          {/* <Context/> */}
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
