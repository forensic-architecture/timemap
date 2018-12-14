import React from 'react'
import Spinner from './Spinner'

import copy from '../../js/data/copy.json'

const CardSource = ({ source, language, isLoading, error }) => {

  function renderContent() {
    if (isLoading) {
      return <Spinner/>
    } else if (source.error) {
      return (
        <div><small>{source.error}</small></div>
      )
    } else {
      /* source with no errors */
      return (
        <div>
          <p>{source.id}</p>
          <i className="material-icons md-36">photo</i>
        </div>
      )
    }
  }

  return (
    <div className="card-row card-cell source">
      {renderContent()}
    </div>
  )
}

export default CardSource
