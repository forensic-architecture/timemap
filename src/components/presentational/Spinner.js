import React from 'react';

const Spinner = ({ small }) => {
  return (
    <div className={`spinner ${small ? 'small' : ''}`}>
      <div className="double-bounce-overlay"></div>
      <div className="double-bounce"></div>
    </div>
  )
}

export default Spinner;
