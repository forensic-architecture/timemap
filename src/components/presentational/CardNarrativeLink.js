import React from 'react';

const CardNarrativeLink = ({ event, makeTimelabel, select }) => {
  if (event !== null) {
    const timelabel = makeTimelabel(event.timestamp);

    return (
      <a onClick={() => select(event)}>
        {`${timelabel} - ${event.location}`}
      </a>
    );
  }

  return (<a className="disabled">None</a>);
}

export default CardNarrativeLink;
