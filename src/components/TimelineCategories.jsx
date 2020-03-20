import React from 'react'
import * as d3 from 'd3'

class TimelineCategories extends React.Component {
  constructor (props) {
    super(props)
    this.grabRef = React.createRef()
    this.state = {
      isInitialized: false
    }
  }

  componentDidUpdate () {
    if (!this.state.isInitialized) {
      const drag = d3.drag()
        .on('start', this.props.onDragStart)
        .on('drag', this.props.onDrag)
        .on('end', this.props.onDragEnd)

      d3.select(this.grabRef.current)
        .call(drag)

      this.setState({ isInitialized: true })
    }
  }

  renderCategory (category, idx) {
    const dims = this.props.dims
    const strokeWidth = dims.trackHeight / (this.props.categories.length + 1)

    return (
      <React.Fragment>
      <g
        class='tick'
        style={{strokeWidth}}
        opacity='0.5'
        transform={`translate(0,${this.props.getCategoryY(category.category)})`}
      >
        <line x1={dims.margin_left} x2={dims.width - dims.width_controls} />
      </g>
      <g class='tick' opacity='1' transform={`translate(0,${this.props.getCategoryY(category.category)})`}>
        <text x={dims.margin_left - 5} dy='0.32em'>{category.category}</text>
      </g>
      </React.Fragment>
    )
  }

  render () {
    const { dims } = this.props

    return (
      <g class='yAxis'>
        {this.props.categories.map((cat, idx) => this.renderCategory(cat, idx))}
        <rect
          ref={this.grabRef}
          class='drag-grabber'
          x={dims.margin_left}
          y={dims.margin_top}
          width={dims.width - dims.margin_left - dims.width_controls}
          height={dims.trackHeight}
        />
      </g>
    )
  }
}

export default TimelineCategories
