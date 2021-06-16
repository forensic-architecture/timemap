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
      buttonWidth: 0,
      spotlights: props.spotlights,
      dimensions: props.dimensions,
    };
  }

  componentDidMount() {
    var resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.computeDims();
      }, 75);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (hash(prevProps.spotlights) !== hash(this.props.spotlights)) {
      const uniqueSpotlights = getUniqueSpotlights(this.props.spotlights);
      const buttonWidth = this.computeButtonWidth(this.state.dimensions);

      this.setState({
        spotlights: uniqueSpotlights,
        xPositions: this.computeXPositions(
          uniqueSpotlights,
          this.state.dimensions,
          buttonWidth
        ),
        buttonWidth: buttonWidth,
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
      buttonWidth,
    } = this.state;

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

  computeXPositions(spotlights, dims, buttonWidth) {
    return spotlights.map((_, idx) => {
      return dims.marginLeft + idx * buttonWidth;
    });
  }

  computeDims() {
    const dom = this.props.dom.spotlightToolbar;
    if (document.querySelector(`#${dom}`) !== null) {
      const boundingClient = document
        .querySelector(`#${dom}`)
        .getBoundingClientRect();

      const newDimensions = {
        width: boundingClient.width,
        height: boundingClient.height,
        ...this.state.dimensions,
      };
      const buttonWidth = this.computeButtonWidth(newDimensions);
      console.info("COMPUTE DIMS BW: ", buttonWidth);
      this.setState({
        dimensions: {
          ...this.props.dimensions,
          width: boundingClient.width,
          height: boundingClient.height,
        },
        xPositions: this.computeXPositions(
          this.state.spotlights,
          newDimensions,
          buttonWidth
        ),
        buttonWidth: buttonWidth,
      });
    }
  }

  computeContentDims(width, height) {
    const { dimensions: dims } = this.state;
    return {
      contentHeight: height - dims.marginLeft,
      contentWidth: width - dims.marginLeft - dims.width_controls,
    };
  }

  computeButtonWidth(dims) {
    const contentDims = this.computeContentDims(dims.width, dims.height);
    return contentDims.contentWidth / this.state.maxInView;
  }

  onSpotlightSelect(title) {
    const { activeSpotlight, actions } = this.props;
    const toggle = activeSpotlight !== title ? title : "";
    actions.setActiveSpotlight(toggle);
  }

  renderSpotlightButtons() {
    const { dimensions: dims, xPositions, buttonWidth } = this.state;
    // const buttonWidth = this.computeButtonWidth(dims);
    const contentDims = this.computeContentDims(dims.width, dims.height);
    // console.info('RENDER BW: ', buttonWidth)
    console.info(
      "BUTTON WIDTH: ",
      buttonWidth,
      "CONTENT WIDTH: ",
      contentDims.contentWidth,
      "X POS IN RENDER: ",
      xPositions
    );
    // const xPositions = this.computeXPositions(this.state.spotlights, dims)
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
                height={contentDims.contentHeight}
              />
              <text
                transform={`translate(${xPos + buttonWidth / 2}, ${
                  contentDims.contentHeight / 2
                })`}
                width={buttonWidth}
                height={contentDims.contentHeight}
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
    const { dimensions } = this.state;
    const { width, height } = dimensions;
    const heightStyle = { height: height };
    const widthStyle = { width: width };

    const containerStyles = { ...heightStyle, ...widthStyle };

    const contentDims = this.computeContentDims(width, height);
    const { contentHeight, contentWidth } = contentDims;

    return (
      <div className="spotlight-wrapper" style={heightStyle}>
        <div
          id={this.props.dom.spotlightToolbar}
          className="spotlight-toolbar"
          style={heightStyle}
        >
          <svg ref={this.svgRef} style={containerStyles}>
            <clipPath id="spotlight-clip">
              <rect
                x={dimensions.marginLeft}
                y="0"
                width={contentWidth}
                height={contentHeight}
              />
            </clipPath>
            {this.renderSpotlightButtons()}
            <Handles
              classes="time-controls-inline"
              dims={{
                ...dimensions,
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
