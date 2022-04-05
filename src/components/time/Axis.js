import React from "react";
import { axisBottom, timeFormat, select } from "d3";
import { setD3Locale } from "../../common/utilities";

const TEXT_HEIGHT = 15;
setD3Locale();
class TimelineAxis extends React.Component {
  constructor() {
    super();
    this.xAxis0Ref = React.createRef();
    this.xAxis1Ref = React.createRef();
    this.state = {
      isInitialized: false,
    };
  }

  componentDidUpdate() {
    let fstFmt, sndFmt;

    // 10yrs
    if (this.props.extent > 5256000) {
      fstFmt = "%Y";
      sndFmt = "";
      // 1yr
    } else if (this.props.extent > 43200) {
      sndFmt = "%d %b";
      fstFmt = "";
    } else {
      sndFmt = "%d %b";
      // fstFmt = "%H:%M";
      fstFmt = "";
    }

    const { marginTop, contentHeight } = this.props.dims;
    if (this.props.scaleX) {
      this.x0 = axisBottom(this.props.scaleX)
        .ticks(this.props.ticks)
        .tickPadding(0)
        .tickSize(contentHeight - TEXT_HEIGHT - marginTop)
        .tickFormat(timeFormat(fstFmt));

      this.x1 = axisBottom(this.props.scaleX)
        .ticks(this.props.ticks)
        .tickPadding(marginTop)
        .tickSize(0)
        .tickFormat(timeFormat(sndFmt));

      if (!this.state.isInitialized) this.setState({ isInitialized: true });
    }

    if (this.state.isInitialized) {
      select(this.xAxis0Ref.current)
        .transition()
        .duration(this.props.transitionDuration)
        .call(this.x0);

      select(this.xAxis1Ref.current)
        .transition()
        .duration(this.props.transitionDuration)
        .call(this.x1);
    }
  }

  render() {
    return (
      <>
        <g
          ref={this.xAxis0Ref}
          transform={`translate(0, ${this.props.dims.marginTop})`}
          clipPath="url(#clip)"
          className="axis xAxis"
        />
        <g
          ref={this.xAxis1Ref}
          transform={`translate(0, ${this.props.dims.marginTop})`}
          clipPath="url(#clip)"
          className="axis xAxis"
        />
      </>
    );
  }
}

export default TimelineAxis;
