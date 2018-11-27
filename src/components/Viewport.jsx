import React from 'react';
import Map from '../js/map/map.js';
import { areEqual } from '../js/data/utilities.js';

class Viewport extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.map = new Map(this.props.app, this.props.ui, this.props.methods);
    this.map.update(this.props.domain, this.props.app);
  }

  componentWillReceiveProps(nextProps) {
    this.map.update(this.props.domain, this.props.app);
  }

  render() {
    return (
      <div className='map-wrapper'>
        <div id="map" />
      </div>
    );
  }
}

export default Viewport;
