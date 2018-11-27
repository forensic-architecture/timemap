import React from 'react';

import CardNarrativeLink from './CardNarrativeLink';

const CardNarrative = (props) => (
  <div className="event-card-section">
    <h4>Connected events</h4>
    <p>Next: <CardNarrativeLink {...props} event={props.next}/></p>
    <p>Previous: <CardNarrativeLink {...props} event={props.prev} /></p>
  </div>
);

export default CardNarrative;
