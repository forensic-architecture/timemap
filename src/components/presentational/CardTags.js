import React from 'react';

import copy from '../../js/data/copy.json';

const CardTags = ({ tags, language }) => {
  const tags_lang = copy[language].cardstack.tags;
  const no_tags_lang = copy[language].cardstack.notags;

  if (tags.length > 0) {
    return (
      <div className="card-cell tags">
        <h4>{tags_lang}</h4>
        <p>
          {tags.map((tag, idx) => {
              return (
                <span className="tag">
                  {tag.name}
                  {(idx < tags.length - 1)
                    ? ','
                    : ''}
                </span>
              );
          })}
        </p>
      </div>
    );
  }
  return (
    <div className="card-cell tags">
      <h4>{tags_lang}</h4>
      <p>{no_tags_lang}</p>
    </div>
  );

}

export default CardTags;
