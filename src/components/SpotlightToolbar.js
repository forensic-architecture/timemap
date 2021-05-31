import React from "react";

class SpotlightToolbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { dims: spotlightDims } = this.props;
    const classes = `spotlight-wrapper`;
    const extraStyles = {};

    return (
      <div className={classes} styles={extraStyles}>
        <div className="spotlight-content" style={spotlightDims.height}>
          <div
            id={this.props.ui.dom.spotlightToolbar}
            className="spotlight-toolbar"
            style={spotlightDims.contentHeight}
          ></div>
        </div>
      </div>
    );
  }
}
