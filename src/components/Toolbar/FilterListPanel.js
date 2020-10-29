import React from 'react'
import Checkbox from '../presentational/Checkbox'
import marked from 'marked'
import copy from '../../common/data/copy.json'
import { getFilterIdxFromColorSet } from '../../common/utilities'

/** recursively get an array of node keys to toggle */
function getFiltersToToggle (filter, activeFilters) {
  const [key, children] = filter

  // base case: no children to recurse through
  if (children === {}) return [key]

  const turningOff = activeFilters.includes(key)
  let childKeys = Object.entries(children)
    .flatMap(filter => getFiltersToToggle(filter, activeFilters))
    .filter(child => activeFilters.includes(child) === turningOff)

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
    const matchingKeys = getFiltersToToggle(filter, activeFilters)
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
          onClickCheckbox={() => onSelectFilter(key, matchingKeys)}
          color={assignedColor}
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
      <p dangerouslySetInnerHTML={{ __html: marked(copy[language].toolbar.explore_by_filter__description) }} />
      {renderTree(filters)}
    </div>
  )
}

export default FilterListPanel
