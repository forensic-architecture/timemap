import React from 'react'
import { connect } from 'react-redux'
import * as selectors from '../selectors'
import hash from 'object-hash';

import Map from './Map.jsx';
import { areEqual } from '../js/utilities.js'

class Viewport extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const classes = this.props.app.narrative ? 'map-wrapper narrative-mode' : 'map-wrapper';
    return (
      <div className={classes}>
        <Map
          mapId="map"
          domain={this.props.domain}
          app={this.props.app}
          ui={this.props.ui}
          methods={this.props.methods}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    domain: {
      locations: selectors.selectLocations(state),
      narratives: selectors.selectNarratives(state),
      categories: selectors.selectCategories(state),
      sites: selectors.getSites(state)
    },
    app: {
      views: state.app.filters.views,
      selected: state.app.selected,
      highlighted: state.app.highlighted,
      mapAnchor: state.app.mapAnchor,
      narrative: state.app.narrative
    },
    ui: {
      dom: state.ui.dom,
      narratives: state.ui.style.narratives
    }
  }
}

export default connect(mapStateToProps)(Viewport)
