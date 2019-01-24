import React from 'react'
import { connect } from 'react-redux'
import * as selectors from '../selectors'

import Card from './presentational/Narrative/Card'
import Adjust from './presentational/Narrative/Adjust'
import Close from './presentational/Narrative/Close'

class Narrative extends React.Component {

  render() {
    if (!this.props.narrative) return null

    const { steps } = this.props.narrative
    const prevExists = this.props.current !== 0
    const nextExists = this.props.current < steps.length - 1

    return (
      <React.Fragment>
        <Card narrative={this.props.narrative} />
        <Adjust
          isDisabled={!prevExists}
          direction='left'
          onClickHandler={this.props.methods.onPrev}
        />
        <Adjust
          isDisabled={!nextExists}
          direction='right'
          onClickHandler={this.props.methods.onNext}
        />
        <Close
          onClickHandler={() => this.props.methods.onSelectNarrative(null)}
          closeMsg='-- exit from narrative --'
        />
      </React.Fragment>
    )
  
  }
}

function mapStateToProps (state) {
  return {
    narrative: selectors.selectActiveNarrative(state),
    current: state.app.narrativeState.current
  }
}

export default connect(mapStateToProps)(Narrative)
