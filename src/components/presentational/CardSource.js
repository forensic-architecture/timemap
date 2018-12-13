import React from 'react'
import Spinner from './Spinner'

import copy from '../../js/data/copy.json'

function renderSource(source) {
  return source.error ? (
    <div><small>{source.error}</small></div>
  ) : (
    <div><p>TODO: display source properly.</p></div>
  )
}

const CardSource = ({ source, language, isLoading, error }) => {
  const source_lang = copy[language].cardstack.source

  function renderContent() {
    return isLoading
      ? <Spinner/>
      : renderSource(source)
  }

  return (
    <div className="card-col card-cell source">
      <h4>{source_lang}: </h4>
      {renderContent()}
    </div>
  )
}

export default CardSource
