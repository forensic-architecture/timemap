import React from 'react'

const CardCaret = ({ isOpen, toggle }) => {
  let classes = (isOpen)
    ? 'arrow-down'
    : 'arrow-down folded'

  return (
    <div className='card-toggle' onClick={toggle}>
      <p>
        <i className={classes} />
      </p>
    </div>
  )
}

export default CardCaret
