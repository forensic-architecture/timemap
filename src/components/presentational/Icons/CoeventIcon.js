import React from 'react'

const CoeventIcon = ({ isEnabled, toggleMapViews }) => {
  return (
    <button
      onClick={() => toggleMapViews('coevents')}
    >
      <svg className='coevents' x='0px' y='0px' width='30px' height='20px' viewBox='0 0 30 20' enableBackground='new 0 0 30 20'>
        <polygon stroke-linejoin='round' stroke-miterlimit='10' points='19.178,20 10.823,20 10.473,14.081
          10,13.396 10,6.084 20,6.084 20,13.396 19.445,14.021 ' />
        <rect className='no-fill' x='11.4' y='7.867' width='7.2' height='3.35' />
        <line stroke-linejoin='round' stroke-miterlimit='10' x1='12.125' y1='1' x2='12.125' y2='5.35' />
        <rect x='11.4' y='4.271' width='1.496' height='1.079' />
        <rect x='17.104' y='4.271' width='1.496' height='1.079' />
      </svg>
    </button>
  )
}

export default CoeventIcon
