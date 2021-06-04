import React from "react";
import * as selectors from "../selectors/index";
import { connect } from "react-redux";
import Handles from "./atoms/Handles";
import { getUniqueSpotlights } from "../common/utilities";
import { Button } from "@forensic-architecture/design-system/dist/react";

class SpotlightToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.svgRef = React.createRef();
    this.state = {
      maxInView: 4,
      startIdx: 0,
      endIdx: props.spotlights.length - 1,
      spotlights: props.spotlights,
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
      this.setState({ spotlights: getUniqueSpotlights(this.props.spotlights) });
    }
  }

  onMoveSpotlight(direction) {
    return [];
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

  renderSpotlights() {
    const styles = {
      height: this.state.dimensions.height,
      width: this.state.dimensions.width,
    };
    return (
      <g className="button-group" style={styles}>
        {this.state.spotlights.map((sp) => {
          return (
            <Button
              primary={true}
              backgroundColor="black"
              borderRadius="10%"
              label={sp.title}
              size="medium"
            />
          );
        })}
      </g>
    );
  }

  render() {
    const { dimensions } = this.state;
    const classes = `spotlight-wrapper`;
    const heightStyle = { height: dimensions.height };
    const contentHeight = { height: dimensions.contentHeight };
    const svgHeight = { height: dimensions.svgHeight };
    const extraStyles = {};

    return (
      <div className={classes} style={extraStyles}>
        <div className="spotlight-content" style={heightStyle}>
          <div
            id={this.props.dom.spotlightToolbar}
            className="spotlight-toolbar"
            style={contentHeight}
          >
            <svg ref={this.svgRef} width={dimensions.width} style={svgHeight}>
              <clipPath id="spotlight-clip">
                <rect
                  x={dimensions.marginLeft}
                  y="0"
                  // width={dimensions.width - dimensions.marginLeft - dimensions.width_controls}
                  width={80}
                  height={dimensions.contentHeight}
                />
              </clipPath>
              {this.renderSpotlights()}
              <Handles
                classes="time-controls-inline"
                dims={dimensions}
                onMove={(dir) => {
                  this.onMoveSpotlight(dir);
                }}
              />
            </svg>
          </div>
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
