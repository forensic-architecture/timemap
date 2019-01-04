import React from 'react';

class TimelineCategories extends React.Component {

  constructor() {
    super();
    this.grabRef = React.createRef()
    this.state = {
      isInitialized: false
    }
  }

  componentDidUpdate() {
    if (!this.state.isInitialized && this.props.timeline) {
      const drag = d3.drag()
      .on('start', this.props.onDragStart)
      .on('drag', this.props.onDrag)
      .on('end', this.props.onDragEnd);

      d3.select(this.grabRef.current)
        .call(drag);

        this.setState({ isInitialized: true });
    }
  }

  getY(idx) {
    return (idx + 1) * this.props.dims.trackHeight / this.props.categories.length
  }

  renderCategory(category, idx) {
    return (
      <g class="tick" opacity="1" transform={`translate(0,${this.getY(idx)})`}>
        <line stroke="currentColor" x1={this.props.dims.margin_left} x2={1026}></line>
        <text fill="currentColor" x={this.props.dims.margin_left} dy="0.32em">{category.category}</text>
      </g>
    )
  }

  render () {
    const dims = this.props.dims;

    return (
      <g
        class="yAxis"
      >
        {this.props.categories.map((cat, idx) => this.renderCategory(cat, idx))}
        <rect
          ref={this.grabRef}
          class="drag-grabber"
          x={dims.margin_left}
          y="20"
          width={dims.width - dims.margin_left}
          height={dims.trackHeight}
        ></rect>
      </g>
    );
  }
}

export default TimelineCategories;