import React from 'react'
import Spinner from './Spinner'

import copy from '../../js/data/copy.json'

const CardSource = ({ source, language, isLoading, error }) => {
  const source_lang = copy[language].cardstack.source

  if (isLoading) {
    return <Spinner />
  }

  function renderSource() {
    return (
      <div><p>TODO: display source properly.</p></div>
    )
  }

  return (
    <div className="card-col card-cell source">
      <h4>{source_lang}: </h4>
      {source.error ? (
        <div><small>{source.error}</small></div>
      ) : (
        renderSource()
      )}
    </div>
  )
}

export default CardSource
