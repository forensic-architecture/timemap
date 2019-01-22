import React from 'react';

import { capitalizeFirstLetter } from '../../../js/utilities.js';

const CardCategory = ({ categoryTitle, categoryLabel, color }) => (
  <div className="card-row card-cell category">
    <h4>{categoryTitle}</h4>
    <p>
      {capitalizeFirstLetter(categoryLabel)}
      <span className='color-category' style={{ background: color }}/>
    </p>
  </div>
);

export default CardCategory;
