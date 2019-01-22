import React from 'react'
import { connect } from 'react-redux'
import { selectActiveNarrative } from '../../../selectors'

function NarrativeCard ({ narrative }) {
  // no display if no narrative
  const { steps, current } = narrative

  if (steps[current]) {
    return (
      <div className='narrative-info'>
        <div className='narrative-info-header'>
          <div className='count-container'>
            <div className='count'>
              {current + 1}/{steps.length}
            </div>
          </div>
          <div>
            <h3>{narrative.label}</h3>
          </div>
        </div>

        {/* <i className='material-icons left'>location_on</i> */}
        {/* {_renderActions(current, steps)} */}
        <div className='narrative-info-desc'>
          <p>{narrative.description}</p>
        </div>
      </div>
    )
  } else {
    return null
  }
}

function mapStateToProps (state) {
  return {
    narrative: selectActiveNarrative(state)
  }
}
export default connect(mapStateToProps)(NarrativeCard)
