import '../scss/main.scss';
import React from 'react';

export default ({ label, isActive, onClickLabel, onClickCheckbox }) => (
  <div className={(isActive) ? 'item active' : 'item'}>
    <span onClick={() => onClickLabel()}>{label}</span>
    <button onClick={() => onClickCheckbox()}>
      <div className="checkbox" />
    </button>
  </div>
);
