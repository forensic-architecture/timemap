import React from 'react';

import copy from '../../js/data/copy.json';

const CardSource = ({ source, language }) => {
  const source_lang = copy[language].cardstack.source;

  return (
    <div className="card-cell source">
      <h4>{source_lang}</h4>
      <p>{source}</p>
    </div>
  );
}

export default CardSource;
