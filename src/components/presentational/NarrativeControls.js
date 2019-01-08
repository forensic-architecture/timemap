import React from 'react'
import NarrativeCard from './NarrativeCard'
import NarrativeAdjust from './NarrativeAdjust'

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

  if (!narrative) return null

  const { current, steps } = narrative
  const prevExists = current !== 0
  const nextExists = current < steps.length - 1

  return (
    <React.Fragment>
      <NarrativeCard narrative={narrative} />
      <NarrativeAdjust
        isDisabled={!prevExists}
        direction='left'
        onClickHandler={methods.onPrev}
      />
      <NarrativeAdjust
        isDisabled={!nextExists}
        direction='right'
        onClickHandler={methods.onNext}
      />
    </React.Fragment>
  )
}
