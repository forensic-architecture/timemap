import '../scss/main.scss';
import React from 'react';
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
        // if event has property 'name', update with event details
        const shouldCardUpdate = (event.name);

        return (
          <Card
              event={event}
              shouldCardUpdate={shouldCardUpdate}
              language={this.props.language}
              tools={this.props.tools}
              isFetchingEvents={this.props.isFetchingEvents}
              getNarrativeLinks={this.props.getNarrativeLinks}
              getCategoryGroup={this.props.getCategoryGroup}
              getCategoryGroupColor={this.props.getCategoryGroupColor}
              getCategoryLabel={this.props.getCategoryLabel}
              highlight={this.props.highlight}
              select={this.props.select}              
          />
        );
      });
    } else {
        return '';
    }
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

  render() {
    const header_lang = copy[this.props.language].cardstack.header;

    if (this.props.isFetchingEvents) {
      return (
        <div id="card-stack" className={`card-stack ${this.props.isCardstack ? '' : ' folded'}`}>
          <div
            id='card-stack-header'
            className='card-stack-header'
            onClick={() => this.props.toggle('TOGGLE_CARDSTACK')}
          >
            <button className="side-menu-burg is-active"><span></span></button>
            <p className="header-copy top">{copy[this.props.language].loading}</p>
          </div>
          <div id="card-stack-content" className="card-stack-content">
            <ul>
              <Card
                language={this.props.language}
                isLoading={true}
              />
            </ul>
          </div>
        </div>
      );
    } else if (this.props.selected.length > 0) {
      return (
        <div id="card-stack" className={`card-stack ${this.props.isCardstack ? '' : ' folded'}`}>
          <div
            id='card-stack-header'
            className='card-stack-header'
            onClick={() => this.props.toggle('TOGGLE_CARDSTACK')}
          >
            <button className="side-menu-burg is-active"><span></span></button>
            <p className="header-copy top">{`${this.props.selected.length} ${header_lang}`}</p>
            {this.renderLocation()}
          </div>
          <div id="card-stack-content" className="card-stack-content">
            <ul>
              {this.renderCards()}
            </ul>
          </div>
        </div>
      );
    }
    return <div/>;
  }
}

export default CardStack;
