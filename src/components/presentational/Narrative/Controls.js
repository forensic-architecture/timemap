import React from 'react'
import Card from './Card'
import Adjust from './Adjust'
import Close from './Close'

export default ({ narrative, methods }) => {
  if (!narrative) return null

  const { current, steps } = narrative
  const prevExists = current !== 0
  const nextExists = current < steps.length - 1

  return (
    <React.Fragment>
      <Card narrative={narrative} />
      <Adjust
        isDisabled={!prevExists}
        direction='left'
        onClickHandler={methods.onPrev}
      />
      <Adjust
        isDisabled={!nextExists}
        direction='right'
        onClickHandler={methods.onNext}
      />
      <Close
        onClickHandler={() => methods.onSelectNarrative(null)}
        closeMsg='-- exit from narrative --'
      />
    </React.Fragment>
  )
}
