import React from 'react'
import Checkbox from '../presentational/Checkbox'
import copy from '../../common/data/copy.json'
import { getFilterIdxFromColorSet, getFilterParents } from '../../common/utilities'

function hasOnParent (filters, activeFilters, filterKey) {
  return getFilterParents(filters, filterKey).some(r => activeFilters.indexOf(r) >= 0)
}

/** recursively get an array of node keys to toggle */
function childrenToToggle (filter, activeFilters, parentOn) {
  const [key, children] = filter
  const isOn = activeFilters.includes(key)
  if (children === {}) {
    return [key]
  }

  let childKeys = Object.entries(children)
    .flatMap(filter => childrenToToggle(filter, activeFilters, parentOn))
    .filter(child => activeFilters.includes(child) === isOn)

  childKeys.push(key)
  return childKeys
}

function aggregatePaths (filters) {
  function insertPath (children = {}, [headOfPath, ...remainder]) {
    let childKey = Object.keys(children).find(key => key === headOfPath)
    if (!childKey) children[headOfPath] = {}
    if (remainder.length > 0) insertPath(children[headOfPath], remainder)
    return children
  }

  const allPaths = []
  filters.forEach(filterItem => allPaths.push(filterItem.filter_paths))

  let aggregatedPaths = allPaths.reduce((children, path) => insertPath(children, path), {})
  return aggregatedPaths
}

function FilterListPanel ({
  filters,
  activeFilters,
  onSelectFilter,
  language,
  coloringSet,
  filterColors
}) {
  function createNodeComponent (filter, depth) {
    const [key, children] = filter
    const parentsActive = getFilterParents(filters, key).map(p => activeFilters.includes(p))

    const anyParentActive = parentsActive.some(t => t)
    const matchingKeys = childrenToToggle(filter, activeFilters, anyParentActive)
    const idxFromColorSet = getFilterIdxFromColorSet(key, coloringSet)
    const assignedColor = idxFromColorSet !== -1 && activeFilters.includes(key) ? filterColors[idxFromColorSet] : ''

    const styles = ({
      color: assignedColor,
      marginLeft: `${depth * 20}px`
    })

    return (
      <li
        key={key.replace(/ /g, '_')}
        className={'filter-filter'}
        style={{ ...styles }}
      >
        <Checkbox
          label={key}
          isActive={activeFilters.includes(key)}
          onClickCheckbox={() => { onSelectFilter(key, matchingKeys) }}
          backgroundColor={assignedColor}
        />
        {Object.keys(children).length > 0
          ? Object.entries(children).map(filter => createNodeComponent(filter, depth + 1))
          : null}
      </li>
    )
  }

  function renderTree (filters) {
    const aggregatedFilterPaths = aggregatePaths(filters)

    return (
      <div>
        {Object.entries(aggregatedFilterPaths).map(filter => createNodeComponent(filter, 1))}
      </div>
    )
  }

  return (
    <div className='react-innertabpanel'>
      <h2>{copy[language].toolbar.filters}</h2>
      <p>{copy[language].toolbar.explore_by_filter__description}</p>
      {renderTree(filters)}
    </div>
  )
}

export default FilterListPanel
