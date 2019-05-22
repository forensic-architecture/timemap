import React from 'react'

import copy from '../../../common/data/copy.json'

const CardSummary = ({ language, description, isHighlighted }) => {
  const summary = copy[language].cardstack.description

  return (
    <div className='card-row summary'>
      <div className='card-cell'>
        <h4>{summary}</h4>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default CardSummary
