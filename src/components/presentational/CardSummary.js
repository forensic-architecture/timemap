import React from 'react';

import copy from '../../js/data/copy.json';

const CardSummary = ({ language, description, isHighlighted }) => {

  const summary = copy[language].cardstack.description;
  const descriptionText = (isHighlighted) ? description : `${description.substring(0, 40)}...`;

  return (
    <div className="card-cell summary">
      <h4>{summary}</h4>
      <p>{descriptionText}</p>
    </div>
  );
}

export default CardSummary;
