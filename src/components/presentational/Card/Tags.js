import React from 'react'

import copy from '../../../common/data/copy.json'

const CardTags = ({ tags, language }) => {
  const tagsLang = copy[language].cardstack.tags
  const noTagsLang = copy[language].cardstack.notags

  if (tags.length > 0) {
    return (
      <div className='card-row card-cell tags'>
        <h4>{tagsLang}:</h4>
        <p>
          {tags.map((tag, idx) => {
            return (
              <span className='tag'>
                <small>{tag.name}</small>
                {(idx < tags.length - 1)
                  ? ','
                  : ''}
              </span>
            )
          })}
        </p>
      </div>
    )
  }
  return (
    <div className='card-row card-cell tags'>
      <h4>{tagsLang}</h4>
      <p><small>{noTagsLang}</small></p>
    </div>
  )
}

export default CardTags
