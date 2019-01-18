import React from 'react';

const CardNarrativeLink = ({ event, makeTimelabel, select }) => {
  if (event !== null) {
    const timelabel = makeTimelabel(event.timestamp);

    return (
      <a onClick={() => select(event)}>
        <small>{`${timelabel} / ${event.location}`}</small>
      </a>
    );
  }

  return (<a className="disabled"><small>None</small></a>);
}

export default CardNarrativeLink;
