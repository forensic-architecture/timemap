import React from 'react'
import Checkbox from '../presentational/Checkbox'
import copy from '../../common/data/copy.json'

/** recursively get an array of node keys */
function allAssociatedKeys (node) {
  if (!node.children) return [node.key]
  const childKeys = Object.values(node.children).flatMap(n => allAssociatedKeys(n))
  childKeys.push(node.key)
  return childKeys
}

function TagListPanel ({
  tags,
  activeTags,
  onTagFilter,
  language
}) {
  function createNodeComponent (node, depth) {
    const matchingKeys = allAssociatedKeys(node)
    const children = Object.values(node.children)
    return (
      <li
        key={node.key.replace(/ /g, '_')}
        className={'tag-filter'}
        style={{ marginLeft: `${depth * 20}px` }}
      >
        {/* <svg width='10' height='10'> */}
        {/*   <g className='tag-inline'> */}
        {/*     <path d='M0,-7.847549217020565L6.796176979388489,3.9237746085102825L-6.796176979388489,3.9237746085102825Z' transform='rotate(270)' /> */}
        {/*   </g> */}
        {/* </svg> */}
        <Checkbox
          label={node.key}
          isActive={activeTags.includes(node.key)}
          onClickCheckbox={() => onTagFilter(matchingKeys)}
        />
        {children.length > 0
          ? children.map(tag => createNodeComponent(tag, depth + 1))
          : null}
      </li>
    )
  }

  function renderTree (children) {
    return (
      <div>
        {Object.values(children).map(tag => createNodeComponent(tag, 1))}
      </div>
    )
  }

  return (
    <div className='react-innertabpanel'>
      <h2>{copy[language].toolbar.tags}</h2>
      <p>{copy[language].toolbar.explore_by_tag__description}</p>
      {renderTree(tags.children)}
    </div>
  )
}

export default TagListPanel
