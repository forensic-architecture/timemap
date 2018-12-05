import React from 'react';

import copy from '../../js/data/copy.json';
import { isNotNullNorUndefined } from '../../js/utilities';

const CardLocation = ({ language, location }) => {

  if (isNotNullNorUndefined(location)) {
    return (
      <p className="card-cell location">
        <p>
          <i className="material-icons left">location_on</i>
          {location}
        </p>
      </p>
    );
  } else {
    const unknown = copy[language].cardstack.unknown_location;
    return (
      <p className="card-cell location">
        <p>
          <i className="material-icons left">location_on</i>
          {unknown}
        </p>
      </p>
    );
  }
}

export default CardLocation;
