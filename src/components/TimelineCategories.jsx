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

  renderCategory (cat, idx) {
    const { features, dims } = this.props
    const strokeWidth = 1 // dims.trackHeight / (this.props.categories.length + 1)
    if (features.GRAPH_NONLOCATED &&
      features.GRAPH_NONLOCATED.categories &&
      features.GRAPH_NONLOCATED.categories.includes(cat)) {
      return null
    }

    return (
      <React.Fragment>
        <g
          class='tick'
          style={{ strokeWidth }}
          opacity='0.5'
          transform={`translate(0,${this.props.getCategoryY(cat)})`}
        >
          <line x1={dims.marginLeft} x2={dims.width - dims.width_controls} />
        </g>
        <g class='tick' opacity='1' transform={`translate(0,${this.props.getCategoryY(cat)})`}>
          <text x={dims.marginLeft - 5} dy='0.32em'>{cat}</text>
        </g>
      </React.Fragment>
    )
  }

  render () {
    const { dims, categories } = this.props
    const categoriesExist = categories && categories.length > 0
    const renderedCategories = categoriesExist
      ? this.props.categories.map((cat, idx) => this.renderCategory(cat, idx))
      : this.renderCategory('Events', 0)

    return (
      <g class='yAxis'>
        {renderedCategories}
        <rect
          ref={this.grabRef}
          class='drag-grabber'
          x={dims.marginLeft}
          y={dims.marginTop}
          width={dims.width - dims.marginLeft - dims.width_controls}
          height={dims.contentHeight}
        />
      </g>
    )
  }
}

export default TimelineCategories
