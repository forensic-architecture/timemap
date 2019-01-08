import React from 'react'
import { connect } from 'react-redux'
import { selectActiveNarrative } from '../../selectors'

function NarrativeCard ({ narrative }) {
  // function renderClose() {
  //   return (
  //     <button
  //       className='side-menu-burg is-active'
  //       onClick={() => { onSelectNarrative(null) }}
  //     >
  //       <span></span>
  //     </button>
  //   )
  // }

  // function _renderActions(current, steps) {
  //   const prevExists = current !== 0
  //   const nextExists = current < steps.length - 1
  //   return (
  //     <div className='actions'>
  //       <div
  //         className={`${prevExists ? '' : 'disabled'} action`}
  //         onClick={prevExists ? onPrev : null}>&larr;
  //       </div>
  //       <div
  //         className={`${nextExists ? '' : 'disabled'} action`}
  //         onClick={nextExists ? onNext : null}>&rarr;
  //       </div>
  //     </div>
  //   )
  // }

  // no display if no narrative
  if (!narrative) return null

  const { steps, current } = narrative

  if (steps[current]) {
    const step = steps[current]

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
        <p className='narrative-info-desc'>{narrative.description}</p>
              </div>
    )
  } else {
    return null
  }
}

function mapStateToProps(state) {
  return {
    narrative: selectActiveNarrative(state)
  }
}
export default connect(mapStateToProps)(NarrativeCard)
