import React from 'react';

import CardNarrativeLink from './NarrativeLink';

const CardNarrative = (props) => (
  <div className="card-row">
    <h4>Connected events</h4>
    <div className="card-cell">
      <p>&larr; <CardNarrativeLink {...props} event={props.next}/></p>
      <p>&rarr; <CardNarrativeLink {...props} event={props.prev} /></p>
    </div>
  </div>
);

export default CardNarrative;
