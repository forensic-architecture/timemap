import React from 'react';

const CardCaret = ({ isHighlighted, toggle }) => {

  let classes = (isHighlighted)
    ? 'arrow-down'
    : 'arrow-down folded';

  return (
    <div className="card-toggle" onClick={toggle}>
      <p>
        <i className={classes}></i>
      </p>
    </div>
  );
}

export default CardCaret;
