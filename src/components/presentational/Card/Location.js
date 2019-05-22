import React from 'react'

import copy from '../../../common/data/copy.json'

const CardLocation = ({ language, location, isPrecise }) => {
  if (location !== '') {
    return (
      <div className='card-cell location'>
        <p>
          <i className='material-icons left'>location_on</i>
          {`${location}${(isPrecise) ? '' : ' (Approximated)'}`}
        </p>
      </div>
    )
  } else {
    const unknown = copy[language].cardstack.unknown_location
    return (
      <div className='card-cell location'>
        <p>
          <i className='material-icons left'>location_on</i>
          {unknown}
        </p>
      </div>
    )
  }
}

export default CardLocation
