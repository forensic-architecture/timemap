import React from 'react';

class TimelineHandles extends React.Component {

  render() {
    const dims = this.props.dims;
    return (
      <g className="time-controls-inline">
        <g transform={`translate(${dims.margin_left + 20}, 62)`} onClick={() => this.props.onMoveTime('backwards')}>
          <circle r="15">
          </circle>
          <path d="M0,-7.847549217020565L6.796176979388489,3.9237746085102825L-6.796176979388489,3.9237746085102825Z" transform="rotate(270)"></path>
        </g>
        <g transform={`translate(${dims.width - 20}, 62)`}  onClick={() => this.props.onMoveTime('forward')}>
          <circle r="15">
          </circle>
          <path d="M0,-7.847549217020565L6.796176979388489,3.9237746085102825L-6.796176979388489,3.9237746085102825Z" transform="rotate(90)"></path>
        </g>
      </g>
    )
  }

}

export default TimelineHandles;