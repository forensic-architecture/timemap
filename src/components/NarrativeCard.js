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

  componentDidMount() {
    if (!this.props.narrative) return

    const step = this.props.narrative.steps[this.state.step];
    this.props.onSelect([step]);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.narrative === this.props.narrative && this.state.step !== prevState.step) {
      const step = this.props.narrative.steps[this.state.step];
      this.props.onSelect([step]);
    } else if (prevProps.narrative !== this.props.narrative && this.props.narrative !== null) {
      this.setState({
        step: 0
      }, () => {
        const step = this.props.narrative.steps[this.state.step];
        this.props.onSelect([step]);
      });
    }
  }

  renderClose() {
    return (
      <button
        className='side-menu-burg is-active'
        onClick={() => { this.props.onSelectNarrative(null); }}
      >
        <span></span>
      </button>
    )
  }

  render() {
    // no display if no narrative
    if (!this.props.narrative) return null

    console.log(this.props.narrative)
    const { steps, current } = this.props.narrative

    if (steps[current]) {
      const step = steps[current];
      console.log('here')

      return (
        <div className='narrative-info'>
          {this.renderClose()}
          <h3>{this.props.narrative.label}</h3>
          <p>{this.props.narrative.description}</p>
          <h6>
            <i className='material-icons left'>location_on</i>
            {this.state.step + 1}/{steps.length}. {step.location}
          </h6>
          <div className='actions'>
            <div className={`${(!this.state.step) ? 'disabled ' : ''} action`} onClick={() => this.goToPrevKeyFrame()}>&larr;</div>
            <div className={`${(this.state.step >= this.props.narrative.steps.length - 1) ? 'disabled ' : ''} action`} onClick={() => this.goToNextKeyFrame()}>&rarr;</div>
          </div>
        </div>
      );
    } else {
      return null
    }
  }
}

function mapStateToProps(state) {
  return {
    narrative: state.app.narrative
  }
}
export default connect(mapStateToProps)(NarrativeCard);
