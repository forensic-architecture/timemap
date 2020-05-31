import React from 'react'

import { capitalize } from '../../../common/utilities.js'

const CardCategory = ({ categoryTitle, categoryLabel, color }) => (
  <div className='card-row card-cell category'>
    <h4>{categoryTitle}</h4>
    <p>
      {capitalize(categoryLabel)}
      <span className='color-category' style={{ background: color }} />
    </p>
  </div>
)

export default CardCategory
