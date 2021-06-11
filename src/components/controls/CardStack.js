import React from "react";
import { connect } from "react-redux";
import hash from "object-hash";
import { bindActionCreators } from "redux";

import {
  Card,
  generateCardLayout,
} from "@forensic-architecture/design-system/dist/react";

import * as selectors from "../../selectors";
import { fetchMediaForEvent, updateMediaCache } from "../../actions";
import {
  getFilterIdxFromColorSet,
  getStaticFilterColorSet,
  appendFiltersToColoringSet,
} from "../../common/utilities";
import copy from "../../common/data/copy.json";
import { COLORING_ALGORITHM_MODE } from "../../common/constants";

class CardStack extends React.Component {
  constructor(props) {
    super(props);
    this.refs = {};
    this.refCardStack = React.createRef();
    this.refCardStackContent = React.createRef();
    this.state = {
      selected: props.selected,
    };
  }

  componentDidUpdate(prevProps) {
    const isNarrative = !!this.props.narrative;

    if (isNarrative) {
      this.scrollToCard();
    }

    if (hash(prevProps.selected) !== hash(this.props.selected)) {
      if (this.props.features.FETCH_EXTERNAL_MEDIA) {
        this.getMediaDataForEvents(this.props.selected).then((data) =>
          this.setState({ selected: data })
        );
      } else {
        this.setState({ selected: this.props.selected });
      }
    }
  }

  scrollToCard() {
    const duration = 500;
    const element = this.refCardStack.current;
    const cardScroll = this.refs[this.props.narrative.current].current
      .offsetTop;

    const start = element.scrollTop;
    const change = cardScroll - start;
    let currentTime = 0;
    const increment = 20;

    // t = current time
    // b = start value
    // c = change in value
    // d = duration
    Math.easeInOutQuad = function (t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t -= 1;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    const animateScroll = function () {
      currentTime += increment;
      const val = Math.easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) setTimeout(animateScroll, increment);
    };
    animateScroll();
  }

  async getMediaDataForEvents(events) {
    const updatedEvts = [];
    const { mediaCache, features } = this.props;
    for (const evt of events) {
      // Caching here only relevant if data doesn't update frequently
      // TO-DO: make robust caching mechanism to speed up bottleneck of media fetch
      if (features.USE_MEDIA_CACHE && evt.id in mediaCache) {
        evt.media = mediaCache[evt.id];
      } else {
        // TO-DO: Make the attr for the media code more generalized; declare field in config
        const { incident_code } = evt;
        let mediaData = {};
        if (incident_code)
          mediaData = await this.props.actions.fetchMediaForEvent(
            incident_code
          );
        evt.media = mediaData || {};
        if (features.USE_MEDIA_CACHE) this.props.actions.updateMediaCache(evt);
      }
      updatedEvts.push(evt);
    }
    return updatedEvts;
  }

  renderCards(events, selections) {
    const { mode, colors, defaultColor } = this.props.coloringConfig;
    const { filters, coloringSet } = this.props;
    // if no selections provided, select all
    if (!selections) {
      selections = events.map((e) => true);
    }
    this.refs = [];

    const updatedColoringSet =
      mode === COLORING_ALGORITHM_MODE.STATIC
        ? appendFiltersToColoringSet(filters, coloringSet)
        : coloringSet;

    const updatedFilterColors =
      mode === COLORING_ALGORITHM_MODE.STATIC
        ? getStaticFilterColorSet(filters, updatedColoringSet, defaultColor)
        : colors;

    const generateTemplate =
      generateCardLayout[this.props.cardUI.layout.template];

    return events.map((event, idx) => {
      const thisRef = React.createRef();
      this.refs[idx] = thisRef;

      return (
        <Card
          ref={thisRef}
          content={generateTemplate({
            event,
            colors: updatedFilterColors,
            coloringSet: updatedColoringSet,
            getFilterIdxFromColorSet,
          })}
          language={this.props.language}
          isLoading={this.props.isLoading}
          isSelected={selections[idx]}
        />
      );
    });
  }

  renderSelectedCards() {
    const { selected } = this.state;

    if (selected.length > 0) {
      return this.renderCards(selected);
    }
    return null;
  }

  renderNarrativeCards() {
    const { narrative } = this.props;
    const showing = narrative.steps;

    const selections = showing.map((_, idx) => idx === narrative.current);

    return this.renderCards(showing, selections);
  }

  renderCardStackHeader() {
    const headerLang = copy[this.props.language].cardstack.header;

    return (
      <div
        id="card-stack-header"
        className="card-stack-header"
        onClick={() => this.props.onToggleCardstack()}
      >
        <button className="side-menu-burg is-active">
          <span />
        </button>
        <p className="header-copy top">
          {`${this.state.selected.length} ${headerLang}`}
        </p>
      </div>
    );
  }

  renderCardStackContent() {
    return (
      <div id="card-stack-content" className="card-stack-content">
        <ul>{this.renderSelectedCards()}</ul>
      </div>
    );
  }

  renderNarrativeContent() {
    return (
      <div
        id="card-stack-content"
        className="card-stack-content"
        ref={this.refCardStackContent}
      >
        <ul>{this.renderNarrativeCards()}</ul>
      </div>
    );
  }

  render() {
    const { isCardstack, narrative, timelineDims } = this.props;
    // TODO: make '237px', which is the narrative header, less hard-coded
    const height = `calc(100% - 237px - ${timelineDims.height}px)`;
    if (this.state.selected.length > 0) {
      if (!narrative) {
        return (
          <div
            id="card-stack"
            className={`card-stack
            ${isCardstack ? "" : " folded"}`}
          >
            {this.renderCardStackHeader()}
            {this.renderCardStackContent()}
          </div>
        );
      } else {
        return (
          <div
            id="card-stack"
            ref={this.refCardStack}
            className={`card-stack narrative-mode
            ${isCardstack ? "" : " folded"}`}
            style={{ height }}
          >
            {this.renderNarrativeContent()}
          </div>
        );
      }
    }

    return <div />;
  }
}

function mapStateToProps(state) {
  return {
    narrative: selectors.selectActiveNarrative(state),
    selected: selectors.selectSelected(state),
    sourceError: state.app.errors.source,
    language: state.app.language,
    isCardstack: state.app.flags.isCardstack,
    isLoading: state.app.flags.isFetchingSources,
    cardUI: state.ui.card,
    coloringConfig: state.ui.coloring,
    coloringSet: state.app.associations.coloringSet,
    filters: selectors.getFilters(state),
    features: state.features,
    mediaCache: state.app.mediaCache,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { fetchMediaForEvent, updateMediaCache },
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CardStack);
