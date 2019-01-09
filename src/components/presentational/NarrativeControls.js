import React from 'react'
import NarrativeCard from './NarrativeCard'
import NarrativeAdjust from './NarrativeAdjust'
import NarrativeClose from './NarrativeClose'

export default ({ narrative, methods }) => {
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
      <NarrativeClose
        onClickHandler={() => methods.onSelectNarrative(null)}
        closeMsg='-- exit from narrative --'
      />
    </React.Fragment>
  )
}
