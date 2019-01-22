import React from 'react'

const Spinner = ({ small }) => {
  return (
    <div className={`spinner ${small ? 'small' : ''}`}>
      <div className='double-bounce-overlay' />
      <div className='double-bounce' />
    </div>
  )
}

export default Spinner
