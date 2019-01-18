import React from 'react'

import copy from '../../js/data/copy.json'
import { isNotNullNorUndefined } from '../../js/utilities'

const CardLocation = ({ language, location }) => {
  if (isNotNullNorUndefined(location)) {
    return (
      <div className='card-cell location'>
        <p>
          <i className='material-icons left'>location_on</i>
          {location}
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
