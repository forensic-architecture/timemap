import React from 'react';

import copy from '../../js/data/copy.json';

const CardSource = ({ source, language }) => {
  const source_lang = copy[language].cardstack.source;
  if (!source) source = copy[language].cardstack.unknown_source;

  return (
    <div className="card-row card-cell source">
      <h4>{source_lang}: </h4>
      <p><small>{source}</small></p>
    </div>
  );
}

export default CardSource;
