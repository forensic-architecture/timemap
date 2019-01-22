import React from 'react'

import copy from '../../../js/data/copy.json'
import { isNotNullNorUndefined } from '../../../js/utilities'

const CardTimestamp = ({ makeTimelabel, language, timestamp }) => {
  // const daytimeLang = copy[language].cardstack.timestamp
  // const estimatedLang = copy[language].cardstack.estimated
  const unknownLang = copy[language].cardstack.unknown_time

  if (isNotNullNorUndefined(timestamp)) {
    const timelabel = makeTimelabel(timestamp)
    return (
      <div className='card-cell timestamp'>
        <p>
          <i className='material-icons left'>today</i>
          {timelabel}
        </p>
      </div>
    )
  } else {
    return (
      <div className='card-cell timestamp'>
        <p>
          <i className='material-icons left'>today</i>
          {unknownLang}
        </p>
      </div>
    )
  }
}

export default CardTimestamp
