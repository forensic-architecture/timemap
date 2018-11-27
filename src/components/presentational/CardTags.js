import React from 'react';

import copy from '../../js/data/copy.json';

const CardTags = ({ tags, language }) => {
  const label = copy[language].cardstack.people;

  return (
    <div className="event-card-section tags">
      <h4>{label}</h4>
      <p>{
          tags.map((tag, idx) => {
            return (
              <span className="tag">
                {tag.name}
                {
                  (idx < tags.length - 1)
                    ? ','
                    : ''
                }
              </span>
            );
          })
        }</p>
    </div>
);
}

export default CardTags;
