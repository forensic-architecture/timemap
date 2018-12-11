import React from 'react'
import Spinner from './Spinner'

import copy from '../../js/data/copy.json'

const CardSource = ({ source, language, isLoading }) => {
  const source_lang = copy[language].cardstack.source
  if (!source) source = copy[language].cardstack.unknown_source

  const content = isLoading ? (
    <Spinner />
  ) : (
    <div><small>{source}</small></div>
  )

  return (
    <div className="card-col card-cell source">
      <h4>{source_lang}: </h4>
      {content}
    </div>
  )
}

export default CardSource
