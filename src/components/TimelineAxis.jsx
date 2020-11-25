import React from 'react'
import * as d3 from 'd3'

const TEXT_HEIGHT = 15

class TimelineAxis extends React.Component {
  constructor () {
    super()
    this.xAxis0Ref = React.createRef()
    this.xAxis1Ref = React.createRef()
    this.state = {
      isInitialized: false
    }
  }

  componentDidUpdate () {
    let fstFmt, sndFmt

    // 10yrs
    if (this.props.extent > 5256000) {
      fstFmt = '%Y'
      sndFmt = ''
    // 1yr
    } else if (this.props.extent > 43200) {
      sndFmt = '%d %b'
      fstFmt = ''
    } else {
      sndFmt = '%d %b'
      fstFmt = '%H:%M'
    }

    let { marginTop, contentHeight } = this.props.dims
    if (this.props.scaleX) {
      this.x0 =
        d3.axisBottom(this.props.scaleX)
          .ticks(10)
          .tickPadding(0)
          .tickSize(contentHeight - TEXT_HEIGHT - marginTop)
          .tickFormat(d3.timeFormat(fstFmt))

      this.x1 =
        d3.axisBottom(this.props.scaleX)
          .ticks(10)
          .tickPadding(marginTop)
          .tickSize(0)
          .tickFormat(d3.timeFormat(sndFmt))

      if (!this.state.isInitialized) this.setState({ isInitialized: true })
    }

    if (this.state.isInitialized) {
      d3.select(this.xAxis0Ref.current)
        .transition()
        .duration(this.props.transitionDuration)
        .call(this.x0)

      d3.select(this.xAxis1Ref.current)
        .transition()
        .duration(this.props.transitionDuration)
        .call(this.x1)
    }
  }

  render () {
    return (
      <React.Fragment>
        <g
          ref={this.xAxis0Ref}
          transform={`translate(0, ${this.props.dims.marginTop})`}
          clipPath={`url(#clip)`}
          className={`axis xAxis`}
        />
        <g
          ref={this.xAxis1Ref}
          transform={`translate(0, ${this.props.dims.marginTop})`}
          clipPath={`url(#clip)`}
          className={`axis xAxis`}
        />
      </React.Fragment>
    )
  }
}

export default TimelineAxis
