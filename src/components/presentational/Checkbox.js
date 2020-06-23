import React from 'react'

export default ({ label, isActive, onClickCheckbox, onClickTitle }) => (
  <div className={(isActive) ? 'item active' : 'item'}>
    <span onClick={() => onClickTitle ? onClickTitle() : onClickCheckbox()}>{label}</span>
    <button onClick={() => onClickCheckbox()}>
      <div className='checkbox' />
    </button>
  </div>
)
