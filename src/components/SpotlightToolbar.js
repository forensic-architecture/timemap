import React from "react";
import * as selectors from "../selectors/index";
import { connect } from "react-redux";
import Handles from "./atoms/Handles";
import { getUniqueSpotlights } from "../common/utilities";

class SpotlightToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.svgRef = React.createRef();
    this.state = {
      maxInView: 4,
      startIdx: 0,
      endIdx: 0,
      spotlightsInView: props.spotlights,
      dimensions: props.dimensions,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", () => {
      this.computeDims();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.spotlights !== this.props.spotlights) {
      this.setState({
        spotlightsInView: getUniqueSpotlights(this.props.spotlights),
      });
    }
  }

  onMoveSpotlight(direction) {
    let { startIdx: start, endIdx: end, maxInView } = this.state;
    if (end === 0) end = maxInView - 1;
    const totalSpotlightLength = this.props.spotlights.length;

    if (direction === "forward") {
      if (
        end < totalSpotlightLength - 1 &&
        start < totalSpotlightLength - maxInView
      ) {
        end += 1;
        start += 1;
      }
    }
    if (direction === "backwards") {
      if (start >= 0 && end > maxInView - 1) {
        start -= 1;
        end -= 1;
      }
    }

    this.setState({
      startIdx: start,
      endIdx: end,
      spotlights: this.props.spotlights.slice(start, end + 1),
    });
  }

  computeDims() {
    const dom = this.props.dom.spotlightToolbar;
    if (document.querySelector(`#${dom}`) !== null) {
      const boundingClient = document
        .querySelector(`#${dom}`)
        .getBoundingClientRect();

      this.setState({
        dimensions: {
          ...this.props.dimensions,
          width: boundingClient.width,
          // height: boundingClient.height
        },
      });
    }
  }

  render() {
    const { dimensions } = this.state;
    const heightStyle = { height: dimensions.height };
    const contentHeight = dimensions.height - dimensions.marginLeft - 30;
    const contentStyles = {
      width: dimensions.width,
      height: contentHeight,
      margin: dimensions.marginLeft,
    };
    const contentWidth =
      dimensions.width - dimensions.marginLeft - dimensions.width_controls;

    return (
      <div className="spotlight-wrapper" style={heightStyle}>
        <div
          id={this.props.dom.spotlightToolbar}
          className="spotlight-toolbar"
          style={heightStyle}
        >
          <svg ref={this.svgRef} style={contentStyles}>
            <clipPath id="spotlight-clip">
              <rect
                x={dimensions.marginLeft}
                y="0"
                width={contentWidth}
                height={contentHeight}
              />
            </clipPath>
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
    dom: state.ui.dom,
    spotlights: selectors.getSpotlights(state),
    activeSpotlight: selectors.getActiveSpotlight(state),
    features: selectors.getFeatures(state),
  };
}

export default connect(mapStateToProps)(SpotlightToolbar);
