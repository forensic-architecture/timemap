import React from 'react'
import Spinner from './Spinner'

import copy from '../../js/data/copy.json'

const CardSource = ({ source, language, isLoading, error }) => {

  return (
    <div className="card-source">
      {isLoading
          ? <Spinner/>
          : (
            <div className="source-row">
              <i className="material-icons md-36 source-icon">photo</i>
              <p>{source.id}</p>
            </div>
          )}
    </div>
  )
}

export default CardSource
