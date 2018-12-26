import React from 'react'
import PropTypes from 'prop-types'
import Spinner from './Spinner'

import copy from '../../js/data/copy.json'

const CardSource = ({ source, isLoading, onClickHandler }) => {

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

  if (!source) {
    return (
      <div className="card-source">
        <div>Error: this source was not found</div>
      </div>
    )
  }
  return (
    <div className="card-source">
      {isLoading
          ? <Spinner/>
          : (
            <div className="source-row" onClick={() => onClickHandler(source)}>
              <i className="material-icons source-icon">
                {renderIconText(source.type)}
              </i>
              <p>{source.id}</p>
            </div>
          )}
    </div>
  )
}

CardSource.propTypes = {
  source: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string
  }),
  isLoading: PropTypes.bool,
  onClickHandler: PropTypes.func.isRequired,
}

export default CardSource
