import React from 'react';

class TimelineCategories extends React.Component {

  constructor() {
    super();

    this.state = { 
      isDragging: false,
      dragPos0: 0,
      scaleXDomain
    }
  }

  getY(idx) {
    const h = 76;
    console.log((idx + 1) * h / this.props.categories.length)
    return (idx + 1) * h / this.props.categories.length;
  }

  renderCategory(cat, idx) {
    return (
      <g class="tick" opacity="1" transform={`translate(0,${this.getY(idx)})`}>
        <line 
          draggable={true}
          style={{ cursor: 'grab' }}
          onDragStart={(ev) => { this.props.onDragStart(ev) }}
          onDrag={(ev) => { this.props.onDrag(ev) }}
          onMouseDown={this.setState({ isDragging: true })}
          onMouseUp={this.setState({ isDragging: false })}
          stroke="red" x2="-720"></line>
        <text fill="blue" x="-723" dy="0.32em">{cat.category}</text>
      </g>
    );
  }

  render () {
    return (
      <g 
        transform="translate(840, 0)" class="yAxis" fill="none" font-size="10" font-family="sans-serif" text-anchor="end"
      >
        <path class="domain" stroke="currentColor" d="M-720,38.5H0.5V76.5H-720"></path>
        {this.props.categories.map((cat, idx) => { return this.renderCategory(cat, idx); })}
      </g>    
    );        
  }
}

export default TimelineCategories;