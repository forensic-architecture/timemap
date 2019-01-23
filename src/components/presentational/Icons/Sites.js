import React from 'react'

const SitesIcon = ({ isActive, isDisabled, onClickHandler }) => {
  let classes = (isActive) ? 'action-button enabled' : 'action-button'
  if (isDisabled) {
    classes = 'action-button disabled'
  }

  return (
    <button
      className={classes}
      onClick={onClickHandler}
    >
      <svg x='0px' y='0px' width='30px' height='20px' viewBox='0 0 30 20' enableBackground='new 0 0 30 20'>
        <path d='M24.615,6.793H5.385c-2.761,0-3,0.239-3,3v0.414c0,2.762,0.239,3,3,3h7.621l1.996,2.432l1.996-2.432h7.618c2.762,0,3-0.238,3-3V9.793C27.615,7.032,27.377,6.793,24.615,6.793z' />
      </svg>
    </button>
  )
}

export default SitesIcon
