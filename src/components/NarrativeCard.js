import React from 'react';
import { connect } from 'react-redux'

class NarrativeCard extends React.Component {

  constructor() {
    super();

    this.state = {
      step: 0
    }
  }

  goToPrevKeyFrame() {
    if (this.state.step > 0) {
      this.setState({ step: this.state.step - 1 });
    }
  }

  goToNextKeyFrame() {
    if (this.state.step < this.props.narrative.steps.length - 1) {
      this.setState({ step: this.state.step + 1 });
    }
  }

  componentDidUpdate() {
    if (this.props.narrative !== null) {
      const step = this.props.narrative.steps[this.state.step];
      this.props.onSelect([step.id]);
    }
  }

  renderClose() {
    return (
      <button
        className="side-menu-burg is-active"
        onClick={() => { this.props.actions.updateNarrative(null); }}
      >
        <span></span>
      </button>
    )
  }

  render() {
    if (this.props.narrative !== null) {
      const steps = this.props.narrative.steps;
      const step = steps[this.state.step];

      return (
        <div className="narrative-info">
          {this.renderClose()}
          <h6>{this.props.narrative.label}</h6>
          <p>{this.props.narrative.description}</p>
          <h3>{this.state.step + 1}/{steps.length}. {step.location}</h3>
          <div className="actions">
            <div className={`${(!this.state.step) ? 'disabled ' : ''} action`} onClick={() => this.goToPrevKeyFrame()}>&larr;</div>
            <div className={`${(this.state.step >= this.props.narrative.steps.length - 1) ? 'disabled ' : ''} action`} onClick={() => this.goToNextKeyFrame()}>&rarr;</div>
          </div>
        </div>
      );
    }
    return (<div/>);
  }
}

function mapStateToProps(state) {
  console.log(state)
  return {
    narrative: state.app.narrative
  }
}
export default connect(mapStateToProps)(NarrativeCard);
