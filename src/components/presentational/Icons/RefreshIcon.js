import React from 'react'

export default ({ isActive, isDisabled, onClickHandler }) => {
  return (
    <svg className='reset' x='0px' y='0px' width='25px' height='25px' viewBox='7.5 7.5 25 25' enableBackground='new 7.5 7.5 25 25'>
      <path stroke-width='2' stroke-miterlimit='10' d='M28.822,16.386c1.354,3.219,0.898,7.064-1.5,9.924
      c-3.419,4.073-9.49,4.604-13.562,1.186c-4.073-3.417-4.604-9.49-1.187-13.562c1.987-2.368,4.874-3.54,7.74-3.433' />
      <polygon points='26.137,12.748 27.621,19.464 28.9,16.741 31.898,16.503' />
    </svg>
  )
}
