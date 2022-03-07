import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as d3 from "d3";
import hash from "object-hash";

import { setLoading, setNotLoading, updateTicks } from "../../actions";
import * as selectors from "../../selectors";
import copy from "../../common/data/copy.json";

import Header from "./atoms/Header";
import Axis from "./Axis";
import Clip from "./atoms/Clip";
import Handles from "./atoms/Handles.js";
import ZoomControls from "./atoms/ZoomControls.js";
import Markers from "./atoms/Markers.js";
import Events from "./atoms/Events.js";
import Categories from "./Categories";

class Timeline extends React.Component {
  constructor(props) {
    super(props);
    this.styleDatetime = this.styleDatetime.bind(this);
    this.getDatetimeX = this.getDatetimeX.bind(this);
    this.getY = this.getY.bind(this);
    this.onApplyZoom = this.onApplyZoom.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.svgRef = React.createRef();
    this.state = {
      isFolded: false,
      dims: props.dimensions,
      scaleX: null,
      scaleY: null,
      timerange: [null, null], // two datetimes
      dragPos0: null,
      transitionDuration: 300,
    };
  }

  componentDidMount() {
    this.addEventListeners();
  }

  componentWillReceiveProps(nextProps) {
    if (hash(nextProps) !== hash(this.props)) {
      this.setState({
        timerange: nextProps.app.timeline.range,
        scaleX: this.makeScaleX(),
      });
    }

    if (
      hash(nextProps.activeCategories) !== hash(this.props.activeCategories) ||
      hash(nextProps.dimensions) !== hash(this.props.dimensions)
    ) {
      const { trackHeight, marginTop } = nextProps.dimensions;
      this.setState({
        scaleY: this.makeScaleY(
          nextProps.activeCategories,
          trackHeight,
          marginTop
        ),
      });
    }

    if (
      nextProps.dimensions.trackHeight !== this.props.dimensions.trackHeight
    ) {
      this.computeDims();
    }
  }

  addEventListeners() {
    window.addEventListener("resize", () => {
      this.computeDims();
    });
    const element = document.querySelector(".timeline-wrapper");
    if (element !== null) {
      element.addEventListener("transitionend", (event) => {
        this.computeDims();
      });
    }
  }

  makeScaleX() {
    return d3
      .scaleTime()
      .domain(this.state.timerange)
      .range([
        this.state.dims.marginLeft,
        this.state.dims.width - this.state.dims.width_controls,
      ]);
  }

  makeScaleY(categories, trackHeight, marginTop) {
    const { features } = this.props;
    if (features.GRAPH_NONLOCATED && features.GRAPH_NONLOCATED.categories) {
      categories = categories.filter(
        (cat) => !features.GRAPH_NONLOCATED.categories.includes(cat.title)
      );
    }

    const extraPadding = 0;
    const catHeight =
      categories.length > 2
        ? trackHeight / categories.length
        : trackHeight / (categories.length + 1);
    const catsYpos = categories.map((g, i) => {
      return (i + 1) * catHeight + marginTop + extraPadding / 2;
    });

    return (cat) => {
      const idx = categories.indexOf(cat);
      return catsYpos[idx];
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.timerange !== this.state.timerange) {
      this.setState({ scaleX: this.makeScaleX() });
    }
  }

  /**
   * Returns the time scale (x) extent in minutes
   */
  getTimeScaleExtent() {
    if (!this.state.scaleX) return 0;
    const timeDomain = this.state.scaleX.domain();
    return (timeDomain[1].getTime() - timeDomain[0].getTime()) / 60000;
  }

  onClickArrow() {
    this.setState((prevState) => {
      return { isFolded: !prevState.isFolded };
    });
  }

  computeDims() {
    const dom = this.props.ui.dom.timeline;
    if (document.querySelector(`#${dom}`) !== null) {
      const boundingClient = document
        .querySelector(`#${dom}`)
        .getBoundingClientRect();

      this.setState(
        {
          dims: {
            ...this.props.dimensions,
            width: boundingClient.width,
          },
        },
        () => {
          this.setState({ scaleX: this.makeScaleX() });
        }
      );
    }
  }

  /**
   * Shift time range by moving forward or backwards
   * @param {String} direction: 'forward' / 'backwards'
   */
  onMoveTime(direction) {
    const extent = this.getTimeScaleExtent();
    const newCentralTime = d3.timeMinute.offset(
      this.state.scaleX.domain()[0],
      extent / 2
    );

    // if forward
    let domain0 = newCentralTime;
    let domainF = d3.timeMinute.offset(newCentralTime, extent);

    // if backwards
    if (direction === "backwards") {
      domain0 = d3.timeMinute.offset(newCentralTime, -extent);
      domainF = newCentralTime;
    }

    this.setState({ timerange: [domain0, domainF] }, () => {
      this.props.methods.onUpdateTimerange(this.state.timerange);
    });
  }

  onCenterTime(newCentralTime) {
    const extent = this.getTimeScaleExtent();

    const domain0 = d3.timeMinute.offset(newCentralTime, -extent / 2);
    const domainF = d3.timeMinute.offset(newCentralTime, +extent / 2);

    this.setState({ timerange: [domain0, domainF] }, () => {
      this.props.methods.onUpdateTimerange(this.state.timerange);
    });
  }

  /**
   * Change display of time range
   * WITHOUT updating the store, or data shown.
   * Used for updates in the middle of a transition, for performance purposes
   */
  onSoftTimeRangeUpdate(timerange) {
    this.setState({ timerange });
  }

  /**
   * Apply zoom level to timeline
   * @param {object} zoom: zoom level from zoomLevels
   */
  onApplyZoom(zoom) {
    const extent = this.getTimeScaleExtent();
    const newCentralTime = d3.timeMinute.offset(
      this.state.scaleX.domain()[0],
      extent / 2
    );
    const { rangeLimits } = this.props.app.timeline;

    let newDomain0 = d3.timeMinute.offset(newCentralTime, -zoom.duration / 2);
    let newDomainF = d3.timeMinute.offset(newCentralTime, zoom.duration / 2);

    if (rangeLimits) {
      // If the store contains absolute time limits,
      // make sure the zoom doesn't go over them
      const minDate = rangeLimits[0];
      const maxDate = rangeLimits[1];

      if (newDomain0 < minDate) {
        newDomain0 = minDate;
        newDomainF = d3.timeMinute.offset(newDomain0, zoom.duration);
      }
      if (newDomainF > maxDate) {
        newDomainF = maxDate;
        newDomain0 = d3.timeMinute.offset(newDomainF, -zoom.duration);
      }
    }

    this.setState(
      {
        timerange: [newDomain0, newDomainF],
      },
      () => {
        this.props.actions.updateTicks(15);
        this.props.methods.onUpdateTimerange(this.state.timerange);
      }
    );
  }

  toggleTransition(isTransition) {
    this.setState({ transitionDuration: isTransition ? 300 : 0 });
  }

  /*
   * Setup drag behavior
   */
  onDragStart() {
    d3.event.sourceEvent.stopPropagation();
    this.setState(
      {
        dragPos0: d3.event.x,
      },
      () => {
        this.toggleTransition(false);
      }
    );
  }

  /*
   * Drag and update
   */
  onDrag() {
    const drag0 = this.state.scaleX.invert(this.state.dragPos0).getTime();
    const dragNow = this.state.scaleX.invert(d3.event.x).getTime();
    const timeShift = (drag0 - dragNow) / 1000;

    const { range, rangeLimits } = this.props.app.timeline;
    let newDomain0 = d3.timeSecond.offset(range[0], timeShift);
    let newDomainF = d3.timeSecond.offset(range[1], timeShift);

    if (rangeLimits) {
      // If the store contains absolute time limits,
      // make sure the zoom doesn't go over them
      const minDate = rangeLimits[0];
      const maxDate = rangeLimits[1];

      newDomain0 = newDomain0 < minDate ? minDate : newDomain0;
      newDomainF = newDomainF > maxDate ? maxDate : newDomainF;
    }

    // Updates components without updating timerange
    this.onSoftTimeRangeUpdate([newDomain0, newDomainF]);
  }

  /**
   * Stop dragging and update data
   */
  onDragEnd() {
    this.toggleTransition(true);
    this.props.methods.onUpdateTimerange(this.state.timerange);
  }

  getDatetimeX(datetime) {
    return this.state.scaleX(datetime);
  }

  getY(event) {
    const { features, domain, activeCategories } = this.props;
    const { USE_CATEGORIES, GRAPH_NONLOCATED } = features;

    const categoriesExist =
      USE_CATEGORIES && activeCategories && activeCategories.length > 0;

    if (!categoriesExist) {
      return this.state.dims.trackHeight / 2;
    }

    const { category } = event;

    if (GRAPH_NONLOCATED && GRAPH_NONLOCATED.categories.includes(category)) {
      const { project } = event;
      return (
        this.state.dims.marginTop +
        domain.projects[project].offset +
        this.props.ui.eventRadius
      );
    }
    if (!this.state.scaleY) return 0;

    return this.state.scaleY(category);
  }

  /**
   * Determines additional styles on the <circle> for each location.
   * A location consists of an array of events (see selectors). The function
   * also has full access to the domain and redux state to derive values if
   * necessary. The function should return an array, where the value at the
   * first index is a styles object for the SVG at the location, and the value
   * at the second index is an optional additional component that renders in
   * the <g/> div.
   */
  styleDatetime(timestamp, category) {
    return [null, null];
  }

  onSelect(event) {
    if (this.props.features.ZOOM_TO_TIMEFRAME_ON_TIMELINE_CLICK) {
      const timeframe = Math.floor(
        this.props.features.ZOOM_TO_TIMEFRAME_ON_TIMELINE_CLICK / 2
      );
      const start = d3.timeMinute.offset(event.datetime, -timeframe);
      const end = d3.timeMinute.offset(event.datetime, timeframe);
      this.props.actions.updateTicks(1);
      this.props.methods.onUpdateTimerange([start, end]);
    }
    this.props.methods.onSelect(event);
  }

  render() {
    const { isNarrative, app } = this.props;
    let classes = `timeline-wrapper ${this.state.isFolded ? " folded" : ""}`;
    classes += app.narrative !== null ? " narrative-mode" : "";
    const { dims } = this.state;
    const foldedStyle = { bottom: this.state.isFolded ? -dims.height : 0 };
    const heightStyle = { height: dims.height };
    const extraStyle = { ...heightStyle, ...foldedStyle };
    const contentHeight = { height: dims.contentHeight };
    const { activeCategories: categories } = this.props;

    return (
      <div
        className={classes}
        style={extraStyle}
        onKeyDown={this.props.onKeyDown}
        tabIndex="1"
      >
        <Header
          title={copy[this.props.app.language].timeline.info}
          from={this.state.timerange[0]}
          to={this.state.timerange[1]}
          onClick={() => {
            this.onClickArrow();
          }}
          hideInfo={isNarrative}
        />
        <div className="timeline-content" style={heightStyle}>
          <div
            id={this.props.ui.dom.timeline}
            className="timeline"
            style={contentHeight}
          >
            <svg ref={this.svgRef} width={dims.width} style={contentHeight}>
              <Clip dims={dims} />
              <Axis
                ticks={app.timeline.dimensions.ticks}
                dims={dims}
                extent={this.getTimeScaleExtent()}
                transitionDuration={this.state.transitionDuration}
                scaleX={this.state.scaleX}
              />
              <Categories
                dims={dims}
                getCategoryY={(category) =>
                  this.getY({ category, project: null })
                }
                onDragStart={() => {
                  this.onDragStart();
                }}
                onDrag={() => {
                  this.onDrag();
                }}
                onDragEnd={() => {
                  this.onDragEnd();
                }}
                categories={categories}
                features={this.props.features}
                fallbackLabel={
                  copy[this.props.app.language].timeline
                    .default_categories_label
                }
              />
              <Handles
                dims={dims}
                onMoveTime={(dir) => {
                  this.onMoveTime(dir);
                }}
              />
              <ZoomControls
                extent={this.getTimeScaleExtent()}
                zoomLevels={this.props.app.timeline.zoomLevels}
                dims={dims}
                onApplyZoom={this.onApplyZoom}
              />
              <Markers
                dims={dims}
                selected={this.props.app.selected}
                getEventX={(ev) => this.getDatetimeX(ev.datetime)}
                getEventY={this.getY}
                categories={categories}
                transitionDuration={this.state.transitionDuration}
                styles={this.props.ui.styles}
                features={this.props.features}
                eventRadius={this.props.ui.eventRadius}
              />
              <Events
                events={this.props.domain.events}
                projects={this.props.domain.projects}
                categories={categories}
                styleDatetime={this.styleDatetime}
                narrative={this.props.app.narrative}
                getDatetimeX={this.getDatetimeX}
                getY={this.getY}
                getHighlights={(group) => {
                  if (group === "None") {
                    return [];
                  }
                  return categories.map((c) => c.group === group);
                }}
                getCategoryColor={this.props.methods.getCategoryColor}
                transitionDuration={this.state.transitionDuration}
                onSelect={this.onSelect}
                dims={dims}
                features={this.props.features}
                setLoading={this.props.actions.setLoading}
                setNotLoading={this.props.actions.setNotLoading}
                eventRadius={this.props.ui.eventRadius}
                filterColors={this.props.ui.filterColors}
                coloringSet={this.props.app.coloringSet}
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
    dimensions: selectors.selectDimensions(state),
    isNarrative: !!state.app.associations.narrative,
    activeCategories: selectors.getActiveCategories(state),
    domain: {
      events: selectors.selectStackedEvents(state),
      projects: selectors.selectProjects(state),
      narratives: state.domain.narratives,
    },
    app: {
      selected: state.app.selected,
      language: state.app.language,
      timeline: state.app.timeline,
      narrative: state.app.associations.narrative,
      coloringSet: state.app.associations.coloringSet,
    },
    ui: {
      dom: state.ui.dom,
      styles: state.ui.style.selectedEvents,
      eventRadius: state.ui.eventRadius,
      filterColors: state.ui.coloring.colors,
    },
    features: selectors.getFeatures(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { setLoading, setNotLoading, updateTicks },
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
