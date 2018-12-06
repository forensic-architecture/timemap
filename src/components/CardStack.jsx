import React from 'react';
import { connect } from 'react-redux'
import * as selectors from '../selectors'

import Card from './Card.jsx';
import copy from '../js/data/copy.json';
import {
  isNotNullNorUndefined
} from '../js/data/utilities.js';

class CardStack extends React.Component {

  constructor(props) {
    super(props);
  }

  renderCards() {
    if (this.props.selected.length > 0) {
      return this.props.selected.map((event) => {
        return (
          <Card
            event={event}
            language={this.props.language}
            tools={this.props.tools}
            getNarrativeLinks={this.props.getNarrativeLinks}
            getCategoryGroup={this.props.getCategoryGroup}
            getCategoryColor={this.props.getCategoryColor}
            getCategoryLabel={this.props.getCategoryLabel}
            highlight={this.props.onHighlight}
            select={this.props.onSelect}
          />
        );
      });
    }
    return '';
  }

  renderLocation() {
    let locationName = copy[this.props.language].cardstack.unknown_location;
    if (this.props.selected.length > 0) {
      if (isNotNullNorUndefined(this.props.selected[0].location)) {
        locationName = this.props.selected[0].location;
      }
      return (<p className="header-copy">in:<b>{` ${locationName}`}</b></p>)
    }
    return '';
  }

  renderCardStackHeader() {
    const header_lang = copy[this.props.language].cardstack.header;

    return (
      <div
        id='card-stack-header'
        className='card-stack-header'
        onClick={() => this.props.onToggleCardstack()}
      >
        <button className="side-menu-burg is-active"><span></span></button>
        <p className="header-copy top">
          {`${this.props.selected.length} ${header_lang}`}
        </p>
      </div>
    )
  }

  renderCardStackContent() {
    return (
      <div id="card-stack-content" className="card-stack-content">
        <ul>
          {this.renderCards()}
        </ul>
      </div>
    );
  }

  render() {
    if (this.props.selected.length > 0) {
      return (
        <div id="card-stack" className={`card-stack ${this.props.isCardstack ? '' : ' folded'}`}>
          {this.renderCardStackHeader()}
          {this.renderCardStackContent()}
        </div>
      );
    }
    return <div/>;
  }
}

function mapStateToProps(state) {
  return {
    selected: state.app.selected,
    language: state.app.language,
    tools: state.ui.tools,
    isCardstack: state.ui.flags.isCardstack,
    isFetchingSources: state.ui.flags.isFetchingSources
  }
}

export default connect(mapStateToProps)(CardStack)
