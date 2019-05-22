import React from 'react'
import Checkbox from '../presentational/Checkbox'
import copy from '../../common/data/copy.json'

function TagListPanel ({
  tags,
  activeTags,
  onTagFilter,
  language
}) {
  function createNodeComponent (node, depth) {
    return (
      <li
        key={node.key.replace(/ /g, '_')}
        className={'tag-filter active'}
        style={{ marginLeft: `${depth * 20}px` }}
      >
        <Checkbox
          label={node.key}
          isActive={activeTags.includes(node.key)}
          onClickCheckbox={() => onTagFilter(node.key)}
        />
      </li>
    )
  }

  function renderTree () {
    /* NOTE: only render first layer of tags */
    return (
      <div>
        {Object.values(tags.children).map(tag => createNodeComponent(tag, 1))}
      </div>
    )
  }

  return (
    <div className='react-innertabpanel'>
      <h2>{copy[language].toolbar.tags}</h2>
      <p>{copy[language].toolbar.explore_by_tag__description}</p>
      {renderTree()}
    </div>
  )
}

export default TagListPanel
