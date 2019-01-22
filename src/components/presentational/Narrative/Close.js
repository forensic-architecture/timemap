import React from 'react'

export default ({ onClickHandler, closeMsg }) => {
  return (
    <div
      className='narrative-close'
      onClick={onClickHandler}
    >
      <button
        className='side-menu-burg is-active'
      >
        <span />
      </button>
      <div className='close-text'>{closeMsg}</div>
    </div>
  )
}
