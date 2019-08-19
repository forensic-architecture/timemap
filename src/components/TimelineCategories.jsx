import React from 'react'
import * as d3 from 'd3'

class TimelineCategories extends React.Component {
  constructor () {
    super()
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
    return (
      <g class='tick' opacity='1' transform={`translate(0,${this.props.getCategoryY(category.category)})`}>
        <line x1={dims.margin_left} x2={dims.width - dims.width_controls} />
        <text x={dims.margin_left - 5} dy='0.32em'>{category.category}</text>
      </g>
    )
  }

  render () {
    const dims = this.props.dims

    return (
      <g
        class='yAxis'
      >
        {this.props.categories.map((cat, idx) => this.renderCategory(cat, idx))}
        <rect
          ref={this.grabRef}
          class='drag-grabber'
          x={dims.margin_left}
          y='20'
          width={dims.width - dims.margin_left - dims.width_controls}
          height={dims.trackHeight}
        />
      </g>
    )
  }
}

export default TimelineCategories
