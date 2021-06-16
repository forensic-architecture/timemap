import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import hash from "object-hash";

import { setActiveSpotlight } from "../actions";
import * as selectors from "../selectors/index";
import { getUniqueSpotlights } from "../common/utilities";

import Handles from "./atoms/Handles";

class SpotlightToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.svgRef = React.createRef();
    this.state = {
      maxInView: 5,
      startIdx: 0,
      endIdx: 0,
      xPositions: [],
      spotlights: props.spotlights,
      dims: props.dimensions,
    };
  }

  componentDidMount() {
    var resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.updateDims();
      }, 75);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (hash(prevProps.spotlights) !== hash(this.props.spotlights)) {
      const uniqueSpotlights = getUniqueSpotlights(this.props.spotlights);
      const newDims = this.computeDims();

      this.setState({
        spotlights: uniqueSpotlights,
        xPositions: this.computeXPositions(uniqueSpotlights, newDims),
        dims: newDims,
      });
    }
  }

  onMoveSpotlight(direction) {
    let {
      xPositions: xPositionsToUpdate,
      startIdx: start,
      endIdx: end,
      maxInView,
      spotlights,
      dims,
    } = this.state;

    const { buttonWidth } = dims;
    const totalSpotlightLength = spotlights.length;

    if (direction === "forward") {
      if (
        end < totalSpotlightLength - 1 &&
        start < totalSpotlightLength - maxInView
      ) {
        end += 1;
        start += 1;
        xPositionsToUpdate = xPositionsToUpdate.map((pos) => pos - buttonWidth);
      }
    }

    if (direction === "backwards") {
      if (start > 0) {
        start -= 1;
        end -= 1;
        xPositionsToUpdate = xPositionsToUpdate.map((pos) => pos + buttonWidth);
      }
    }

    this.setState({
      startIdx: start,
      endIdx: end,
      xPositions: xPositionsToUpdate,
    });
  }

  computeXPositions(spotlights, dims) {
    return spotlights.map((_, idx) => {
      return dims.marginLeft + idx * dims.buttonWidth;
    });
  }

  updateDims() {
    const updatedDims = this.computeDims();
    this.setState({
      dims: updatedDims,
      xPositions: this.computeXPositions(this.state.spotlights, updatedDims),
    });
  }

  computeDims() {
    const dom = this.props.dom.spotlightToolbar;
    if (document.querySelector(`#${dom}`) !== null) {
      const boundingClient = document
        .querySelector(`#${dom}`)
        .getBoundingClientRect();

      const updatedDims = {
        ...this.state.dims,
        width: boundingClient.width,
        height: boundingClient.height,
      };

      const { contentHeight, contentWidth } = this.computeContentDims(
        updatedDims
      );

      const newDims = {
        ...updatedDims,
        contentHeight,
        contentWidth,
        buttonWidth: contentWidth / this.state.maxInView,
      };

      return newDims;
    }
  }

  computeContentDims(dims) {
    const { height, width, marginLeft, width_controls } = dims;
    return {
      contentHeight: height - marginLeft,
      contentWidth: width - marginLeft - width_controls,
    };
  }

  onSpotlightSelect(title) {
    const { activeSpotlight, actions } = this.props;
    const toggle = activeSpotlight !== title ? title : "";
    actions.setActiveSpotlight(toggle);
  }

  renderSpotlightButtons() {
    const { dims, xPositions } = this.state;
    const { contentHeight, buttonWidth } = dims;

    return (
      <g className="spotlight-group">
        {this.state.spotlights.map((sp, idx) => {
          const { title } = sp;
          const xPos = xPositions[idx];
          const classes = `spotlight-button ${
            this.props.activeSpotlight === title ? " active" : ""
          }`;
          return (
            <g
              clipPath="url(#spotlight-clip)"
              className={classes}
              onClick={() => this.onSpotlightSelect(title)}
            >
              <rect
                transform={`translate(${xPos}, 0)`}
                width={buttonWidth}
                height={contentHeight}
              />
              <text
                transform={`translate(${xPos + buttonWidth / 2}, ${
                  contentHeight / 2
                })`}
                width={buttonWidth}
                height={contentHeight}
              >
                {title}
              </text>
            </g>
          );
        })}
      </g>
    );
  }

  render() {
    const { dims } = this.state;
    const { width, height, contentHeight, contentWidth } = dims;
    const heightStyle = { height: height };
    const widthStyle = { width: width };

    const containerStyles = { ...heightStyle, ...widthStyle };

    return (
      <div className="spotlight-wrapper" style={heightStyle}>
        <div className="spotlight-header">
          <p>{this.props.header}</p>
        </div>
        <div
          id={this.props.dom.spotlightToolbar}
          className="spotlight-toolbar"
          style={heightStyle}
        >
          <svg ref={this.svgRef} style={containerStyles}>
            <clipPath id="spotlight-clip">
              <rect
                x={dims.marginLeft}
                y="0"
                width={contentWidth}
                height={contentHeight}
              />
            </clipPath>
            {this.renderSpotlightButtons()}
            <Handles
              classes="time-controls-inline"
              dims={{
                ...dims,
                contentHeight: contentHeight,
                heightDiffControls: contentHeight / 2,
              }}
              onMove={(dir) => {
                this.onMoveSpotlight(dir);
              }}
            />
          </svg>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    dimensions: state.app.spotlightToolbar.dimensions,
    header: state.app.spotlightToolbar.header,
    dom: state.ui.dom,
    spotlights: selectors.getSpotlights(state),
    activeSpotlight: selectors.getActiveSpotlight(state),
    features: selectors.getFeatures(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ setActiveSpotlight }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SpotlightToolbar);
