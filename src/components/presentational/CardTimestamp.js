import React from 'react';

import copy from '../../js/data/copy.json';
import { isNotNullNorUndefined } from '../../js/utilities';

const CardTimestamp = ({ makeTimelabel, language, timestamp }) => {

  const daytime_lang = copy[language].cardstack.timestamp;
  const estimated_lang = copy[language].cardstack.estimated;
  const unknown_lang = copy[language].cardstack.unknown_time;

  if (isNotNullNorUndefined(timestamp)) {
    const timelabel = makeTimelabel(timestamp);
    return (
      <div className="event-card-section timestamp">
        <h4>{daytime_lang}</h4>
        {timelabel}
      </div>
    );
  } else {
    return (
      <div className="event-card-section timestamp">
        <h4>{daytime_lang}</h4>
        {unknown_lang}
      </div>
    );
  }
}

export default CardTimestamp;
