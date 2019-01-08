import React from 'react'
import NarrativeCard from './NarrativeCard'

export default ({ narrative, methods }) => {
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



  return (
    <React.Fragment>
      <NarrativeCard narrative={narrative} />
    </React.Fragment>
  )
}
