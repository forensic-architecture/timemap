import React from 'react';

import copy from '../../js/data/copy.json';
import { isNotNullNorUndefined } from '../../js/utilities';

const CardLocation = ({ language, location }) => {

  const location_lang = copy[language].cardstack.location;
  if (isNotNullNorUndefined(location)) {
    return (
      <p className="event-card-section location">
        <h4>{location_lang}</h4>
        <p>{location}</p>
      </p>
    );
  } else {
    return (
      <p className="event-card-section location">
        <h4>{location_lang}</h4>
        <p>Sin localización conocida.</p>
      </p>
    );
  }
}

export default CardLocation;
