import React from 'react'
import { connect } from 'react-redux'
import * as selectors from '../selectors'
import Map from '../js/map/map.js'
import { areEqual } from '../js/utilities.js'

class Viewport extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.map = new Map(this.props.app, this.props.ui, this.props.methods)
    this.map.update(this.props.domain, this.props.app)
  }

  componentWillReceiveProps(nextProps) {
    this.map.update(nextProps.domain, nextProps.app)
  }

  render() {
    return (
      <div className='map-wrapper'>
        <div id="map" />
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
      mapAnchor: state.app.mapAnchor
    },
    ui: {
      dom: state.ui.dom,
      narratives: state.ui.style.narratives
    }
  }
}

export default connect(mapStateToProps)(Viewport)
