import '../scss/main.scss';
import React from 'react';

export default ({ label, isActive, onClickCheckbox }) => (
  <div className={(isActive) ? 'item active' : 'item'}>
    <span onClick={() => onClickCheckbox()}>{label}</span>
    <button onClick={() => onClickCheckbox()}>
      <div className="checkbox" />
    </button>
  </div>
);
