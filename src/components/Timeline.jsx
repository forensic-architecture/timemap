import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import * as selectors from '../selectors'
import { setLoading, setNotLoading } from '../actions'
import hash from 'object-hash'

import copy from '../common/data/copy.json'
import Header from './presentational/Timeline/Header'
import Axis from './TimelineAxis.jsx'
import Clip from './presentational/Timeline/Clip'
import Handles from './presentational/Timeline/Handles.js'
import ZoomControls from './presentational/Timeline/ZoomControls.js'
import Markers from './presentational/Timeline/Markers.js'
import Events from './presentational/Timeline/Events.js'
import Categories from './TimelineCategories.jsx'

class Timeline extends React.Component {
  constructor (props) {
    super(props)
    this.styleDatetime = this.styleDatetime.bind(this)
    this.getDatetimeX = this.getDatetimeX.bind(this)
    this.getY = this.getY.bind(this)
    this.onApplyZoom = this.onApplyZoom.bind(this)
    this.svgRef = React.createRef()
    this.state = {
      isFolded: false,
      dims: props.dimensions,
      scaleX: null,
      scaleY: null,
      timerange: [null, null], // two datetimes
      dragPos0: null,
      transitionDuration: 300
    }
  }

  componentDidMount () {
    this.addEventListeners()
  }

  componentWillReceiveProps (nextProps) {
    if (hash(nextProps) !== hash(this.props)) {
      this.setState({
        timerange: nextProps.app.timeline.range,
        scaleX: this.makeScaleX()
      })
    }

    if ((hash(nextProps.domain.categories) !== hash(this.props.domain.categories)) || hash(nextProps.dimensions) !== hash(this.props.dimensions)) {
      const { trackHeight, marginTop } = nextProps.dimensions
      this.setState({
        scaleY: this.makeScaleY(nextProps.domain.categories, trackHeight, marginTop)
      })
    }

    if (nextProps.dimensions.trackHeight !== this.props.dimensions.trackHeight) {
      this.computeDims()
    }

    if (hash(nextProps.app.selected) !== hash(this.props.app.selected)) {
      if (!!nextProps.app.selected && nextProps.app.selected.length > 0) {
        this.onCenterTime(nextProps.app.selected[0].datetime)
      }
    }
  }

  addEventListeners () {
    window.addEventListener('resize', () => { this.computeDims() })
    let element = document.querySelector('.timeline-wrapper')
    if (element !== null) {
      element.addEventListener('transitionend', (event) => {
        this.computeDims()
      })
    }
  }

  makeScaleX () {
    return d3.scaleTime()
      .domain(this.state.timerange)
      .range([this.state.dims.marginLeft, this.state.dims.width - this.state.dims.width_controls])
  }

  makeScaleY (categories, trackHeight, marginTop) {
    const { features } = this.props
    if (features.GRAPH_NONLOCATED && features.GRAPH_NONLOCATED.categories) {
      categories = categories.filter(cat => !features.GRAPH_NONLOCATED.categories.includes(cat.category))
    }
    const catHeight = trackHeight / (categories.length)
    const shiftUp = trackHeight / (categories.length) / 2
    const marginShift = marginTop === 0 ? 0 : marginTop
    const manualAdjustment = trackHeight <= 60 ? (trackHeight <= 30 ? -8 : -5) : 0
    const catsYpos = categories.map((g, i) => {
      return ((i + 1) * catHeight) - shiftUp + marginShift + manualAdjustment
    })
    const catMap = categories.map(c => c.category)
    return (cat) => {
      const idx = catMap.indexOf(cat)
      return catsYpos[idx]
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.timerange !== this.state.timerange) {
      this.setState({ scaleX: this.makeScaleX() })
    }
  }

  /**
   * Returns the time scale (x) extent in minutes
   */
  getTimeScaleExtent () {
    if (!this.state.scaleX) return 0
    const timeDomain = this.state.scaleX.domain()
    return (timeDomain[1].getTime() - timeDomain[0].getTime()) / 60000
  }

  onClickArrow () {
    this.setState((prevState, props) => {
      return { isFolded: !prevState.isFolded }
    })
  }

  computeDims () {
    const dom = this.props.ui.dom.timeline
    if (document.querySelector(`#${dom}`) !== null) {
      const boundingClient = document.querySelector(`#${dom}`).getBoundingClientRect()

      this.setState({
        dims: {
          ...this.props.dimensions,
          width: boundingClient.width
        }
      },
      () => {
        this.setState({ scaleX: this.makeScaleX() })
      })
    }
  }

  /**
   * Shift time range by moving forward or backwards
   * @param {String} direction: 'forward' / 'backwards'
   */
  onMoveTime (direction) {
    this.props.methods.onSelect()
    const extent = this.getTimeScaleExtent()
    const newCentralTime = d3.timeMinute.offset(this.state.scaleX.domain()[0], extent / 2)

    // if forward
    let domain0 = newCentralTime
    let domainF = d3.timeMinute.offset(newCentralTime, extent)

    // if backwards
    if (direction === 'backwards') {
      domain0 = d3.timeMinute.offset(newCentralTime, -extent)
      domainF = newCentralTime
    }

    this.setState({ timerange: [domain0, domainF] }, () => {
      this.props.methods.onUpdateTimerange(this.state.timerange)
    })
  }

  onCenterTime (newCentralTime) {
    const extent = this.getTimeScaleExtent()

    const domain0 = d3.timeMinute.offset(newCentralTime, -extent / 2)
    const domainF = d3.timeMinute.offset(newCentralTime, +extent / 2)

    this.setState({ timerange: [domain0, domainF] }, () => {
      this.props.methods.onUpdateTimerange(this.state.timerange)
    })
  }

  /**
   * Change display of time range
   * WITHOUT updating the store, or data shown.
   * Used for updates in the middle of a transition, for performance purposes
   */
  onSoftTimeRangeUpdate (timerange) {
    this.setState({ timerange })
  }

  /**
   * Apply zoom level to timeline
   * @param {object} zoom: zoom level from zoomLevels
   */
  onApplyZoom (zoom) {
    const extent = this.getTimeScaleExtent()
    const newCentralTime = d3.timeMinute.offset(this.state.scaleX.domain()[0], extent / 2)
    const { rangeLimits } = this.props.app.timeline

    let newDomain0 = d3.timeMinute.offset(newCentralTime, -zoom.duration / 2)
    let newDomainF = d3.timeMinute.offset(newCentralTime, zoom.duration / 2)

    if (rangeLimits) {
      // If the store contains absolute time limits,
      // make sure the zoom doesn't go over them
      const minDate = rangeLimits[0]
      const maxDate = rangeLimits[1]

      if (newDomain0 < minDate) {
        newDomain0 = minDate
        newDomainF = d3.timeMinute.offset(newDomain0, zoom.duration)
      }
      if (newDomainF > maxDate) {
        newDomainF = maxDate
        newDomain0 = d3.timeMinute.offset(newDomainF, -zoom.duration)
      }
    }

    this.setState({ timerange: [
      newDomain0,
      newDomainF
    ] }, () => {
      this.props.methods.onUpdateTimerange(this.state.timerange)
    })
  }

  toggleTransition (isTransition) {
    this.setState({ transitionDuration: (isTransition) ? 300 : 0 })
  }

  /*
   * Setup drag behavior
   */
  onDragStart () {
    d3.event.sourceEvent.stopPropagation()
    this.setState({
      dragPos0: d3.event.x
    }, () => {
      this.toggleTransition(false)
    })
  }

  /*
   * Drag and update
   */
  onDrag () {
    const drag0 = this.state.scaleX.invert(this.state.dragPos0).getTime()
    const dragNow = this.state.scaleX.invert(d3.event.x).getTime()
    const timeShift = (drag0 - dragNow) / 1000

    const { range, rangeLimits } = this.props.app.timeline
    let newDomain0 = d3.timeSecond.offset(range[0], timeShift)
    let newDomainF = d3.timeSecond.offset(range[1], timeShift)

    if (rangeLimits) {
      // If the store contains absolute time limits,
      // make sure the zoom doesn't go over them
      const minDate = rangeLimits[0]
      const maxDate = rangeLimits[1]

      newDomain0 = (newDomain0 < minDate) ? minDate : newDomain0
      newDomainF = (newDomainF > maxDate) ? maxDate : newDomainF
    }

    // Updates components without updating timerange
    this.onSoftTimeRangeUpdate([newDomain0, newDomainF])
  }

  /**
   * Stop dragging and update data
   */
  onDragEnd () {
    this.toggleTransition(true)
    this.props.methods.onUpdateTimerange(this.state.timerange)
  }

  getDatetimeX (datetime) {
    return this.state.scaleX(datetime)
  }

  getY (event) {
    const { features, domain } = this.props
    const { USE_CATEGORIES, GRAPH_NONLOCATED } = features

    if (!USE_CATEGORIES) { return this.state.dims.trackHeight / 2 }

    const { category, project } = event
    if (GRAPH_NONLOCATED && GRAPH_NONLOCATED.categories.includes(category)) {
      return this.state.dims.marginTop + domain.projects[project].offset + this.props.ui.eventRadius
    }
    return this.state.scaleY(category)
  }

  /**
   * Determines additional styles on the <circle> for each location.
   * A location consists of an array of events (see selectors). The function
   * also has full access to the domain and redux state to derive values if
   * necessary. The function should return an array, where the value at the
   * first index is a styles object for the SVG at the location, and the value
   * at the second index is an optional additional component that renders in
   * the <g/> div.
   */
  styleDatetime (timestamp, category) {
    return [null, null]
  }

  render () {
    const { isNarrative, app } = this.props
    let classes = `timeline-wrapper ${(this.state.isFolded) ? ' folded' : ''}`
    classes += (app.narrative !== null) ? ' narrative-mode' : ''
    const { dims } = this.state
    const foldedStyle = { bottom: this.state.isFolded ? -dims.height : 0 }
    const heightStyle = { height: dims.height }
    const extraStyle = { ...heightStyle, ...foldedStyle }
    const contentHeight = { height: dims.contentHeight }
    const { categories } = this.props.domain

    return (
      <div className={classes} style={extraStyle}>
        <Header
          title={copy[this.props.app.language].timeline.info}
          from={this.state.timerange[0]}
          to={this.state.timerange[1]}
          onClick={() => { this.onClickArrow() }}
          hideInfo={isNarrative}
        />
        <div className='timeline-content' style={heightStyle}>
          <div id={this.props.ui.dom.timeline} className='timeline' style={contentHeight} >
            <svg
              ref={this.svgRef}
              width={dims.width}
              style={contentHeight}
            >
              <Clip
                dims={dims}
              />
              <Axis
                dims={dims}
                extent={this.getTimeScaleExtent()}
                transitionDuration={this.state.transitionDuration}
                scaleX={this.state.scaleX}
              />
              <Categories
                dims={dims}
                getCategoryY={category => this.getY({ category, project: null })}
                onDragStart={() => { this.onDragStart() }}
                onDrag={() => { this.onDrag() }}
                onDragEnd={() => { this.onDragEnd() }}
                categories={this.props.domain.categories}
                features={this.props.features}
              />
              <Handles
                dims={dims}
                onMoveTime={(dir) => { this.onMoveTime(dir) }}
              />
              <ZoomControls
                extent={this.getTimeScaleExtent()}
                zoomLevels={this.props.app.timeline.zoomLevels}
                dims={dims}
                onApplyZoom={this.onApplyZoom}
              />
              <Markers
                dims={dims}
                selected={this.props.app.selected}
                getEventX={ev => this.getDatetimeX(ev.datetime)}
                getEventY={this.getY}
                transitionDuration={this.state.transitionDuration}
                styles={this.props.ui.styles}
                features={this.props.features}
                eventRadius={this.props.ui.eventRadius}
              />
              <Events
                events={this.props.domain.events}
                projects={this.props.domain.projects}
                styleDatetime={this.styleDatetime}
                narrative={this.props.app.narrative}
                getDatetimeX={this.getDatetimeX}
                getY={this.getY}
                getHighlights={group => {
                  if (group === 'None') {
                    return []
                  }
                  return categories.map(c => c.group === group)
                }}
                getCategoryColor={this.props.methods.getCategoryColor}
                transitionDuration={this.state.transitionDuration}
                onSelect={this.props.methods.onSelect}
                dims={dims}
                features={this.props.features}
                setLoading={this.props.actions.setLoading}
                setNotLoading={this.props.actions.setNotLoading}
                eventRadius={this.props.ui.eventRadius}
              />
            </svg>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    dimensions: selectors.selectDimensions(state),
    isNarrative: !!state.app.narrative,
    domain: {
      events: selectors.selectStackedEvents(state),
      projects: selectors.selectProjects(state),
      categories: selectors.getCategories(state),
      narratives: state.domain.narratives
    },
    app: {
      selected: state.app.selected,
      language: state.app.language,
      timeline: state.app.timeline,
      narrative: state.app.narrative
    },
    ui: {
      dom: state.ui.dom,
      styles: state.ui.style.selectedEvents,
      eventRadius: state.ui.eventRadius
    },
    features: selectors.getFeatures(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({ setLoading, setNotLoading }, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timeline)
