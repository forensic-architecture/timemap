import React from 'react'
import Spinner from './Spinner'

import copy from '../../js/data/copy.json'

const CardSource = ({ source, language, isLoading, error }) => {

  function renderIconText(type) {
    switch(type) {
      case 'Eyewitness Testimony':
        return 'visibility'
      case 'Government Data':
        return 'public'
      case 'Satellite Imagery':
        return 'satellite'
      case 'Second-Hand Testimony':
        return 'visibility_off'
      case 'Video':
        return 'videocam'
      case 'Photo':
        return 'photo'
      default:
        return 'help'
    }
  }

  return (
    <div className="card-source">
      {isLoading
          ? <Spinner/>
          : (
            <div className="source-row">
              <i className="material-icons source-icon">
                {renderIconText(source.type)}
              </i>
              <p>{source.id}</p>
            </div>
          )}
    </div>
  )
}

export default CardSource
