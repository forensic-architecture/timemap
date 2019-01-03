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
      .on('start', this.props.timeline.onDragStart)
      .on('drag', this.props.timeline.onDrag)
      .on('end', this.props.timeline.onDragEnd);

      d3.select(this.grabRef.current)
        .call(drag);

        this.setState({ isInitialized: true });
    }
  }

  getY(idx) {
    return (idx + 1) * 80 / this.props.categories.length
  }

  renderCategory(category, idx) {
    return (
      <g class="tick" opacity="1" transform={`translate(0,${this.getY(idx)})`}>
        <line stroke="currentColor" x1={120} x2={1026}></line>
        <text fill="currentColor" x={120} dy="0.32em">{category.category}</text>
      </g>
    )
  }

  render () {
    return (
      <g
        transform="translate(0, 0)" class="yAxis" fill="none"
      >
        {this.props.categories.map((cat, idx) => this.renderCategory(cat, idx))}
        <rect
          ref={this.grabRef}
          class="drag-grabber" x="120" y="20" width="906" height="80"
        ></rect>
      </g>
    );
  }
}

export default TimelineCategories;