import React, { useState } from 'react'
import Checkbox from '../presentational/Checkbox'
import copy from '../../common/data/copy.json'

/** recursively get an array of node keys to toggle */
function childrenToToggle (node, activeFilters, parentOn) {
  const isOn = activeFilters.includes(node.key)
  if (!node.children) {
    return [node.key]
  }
  const childKeys = Object.values(node.children)
    .flatMap(n => childrenToToggle(n, activeFilters, isOn))
  // NB: if turning a parent off, don't toggle off children on.
  //     likewise if turning a parent on, don't toggle on children off
  if (!((!parentOn && isOn) || (parentOn && !isOn))) {
    childKeys.push(node.key)
  }
  return childKeys
}

class FilterDisplay extends React.Component {
  constructor (props) {
    super(props)
    this.onClickTitle = this.onClickTitle.bind(this)
  }

  onClickTitle () {
    this.forceUpdate()
    this.props.onCheckboxTitle()
  }

  render () {
    const { node, children, isFoldable, activeFilters, onCheckboxMark, style } = this.props
    return (
      <li
        key={node.key.replace(/ /g, '_')}
        className={'filter-filter'}
        style={style}
      >
        {isFoldable && <div className='caret right' />}
        <Checkbox
          label={node.key}
          isActive={activeFilters.includes(node.key)}
          onClickTitle={this.onClickTitle}
          onClickCheckbox={onCheckboxMark}
        />
        { children }
      </li>
    )
  }
}

function createNodeComponent (node, depth, isFoldable, isOpen, toggle, activeFilters, onSelectFilter) {
  const matchingKeys = childrenToToggle(node, activeFilters, activeFilters.includes(node.key))
  const children = Object.values(node.children)

  return (
    <FilterDisplay
      node={node}
      activeFilters={activeFilters}
      isFoldable={isFoldable}
      onCheckboxTitle={toggle}
      onCheckboxMark={() => onSelectFilter(matchingKeys)}
      style={{ marginLeft: `${depth * 20}px` }}
    >
      {(isFoldable && isOpen) && children.map(filter => createNodeComponent(filter, depth + 1))}
    </FilterDisplay>
  )
}

class RenderTree extends React.Component {
  toggleOpen (atIdx) {
    const me = this
    return () => {
      me.props.toggleOpen(atIdx)
      me.forceUpdate()
    }
  }
  render () {
    const { children, activeFilters, onSelectFilter, isOpens } = this.props
    console.log(activeFilters)
    let filterFoldIdx = 0
    const body = Object.values(children).map(filter => {
      const isFoldable = Object.keys(filter.children).length > 0
      const foldIdx = filterFoldIdx
      if (isFoldable) { filterFoldIdx++ }
      const isOpen = !isFoldable ? null : isOpens[foldIdx]

      return createNodeComponent(filter, 1, isFoldable, isOpen, this.toggleOpen(foldIdx), activeFilters, onSelectFilter)
    })

    return (
      <div>
        {Object.values(children).map(filter => {
          const isFoldable = Object.keys(filter.children).length > 0
          const foldIdx = filterFoldIdx
          if (isFoldable) { filterFoldIdx++ }
          const isOpen = !isFoldable ? null : isOpens[foldIdx]

          return createNodeComponent(filter, 1, isFoldable, isOpen, this.toggleOpen(foldIdx), activeFilters, onSelectFilter)
        })}
      </div>
    )
  }
}

function FilterListPanel ({
  filters,
  activeFilters,
  onSelectFilter,
  filterFoldCount,
  language
}) {
  // set up array of bools based on `filterFoldCount`, which was calculated
  // during domain verification (see validate.js). This is necessary because
  // React hooks must be instantiated at the top level.
  const [isOpens, setOpens] = useState([...Array(filterFoldCount).keys()].map(t => !!t))
  const toggleOpen = idx => {
    const oldList = isOpens
    oldList[idx] = !oldList[idx]
    setOpens(oldList)
  }

  return (
    <div className='react-innertabpanel'>
      <h2>{copy[language].toolbar.filters}</h2>
      <p>{copy[language].toolbar.explore_by_filter__description}</p>
      <RenderTree
        children={filters.children}
        toggleOpen={toggleOpen}
        activeFilters={activeFilters}
        onSelectFilter={onSelectFilter}
        isOpens={isOpens}
      />
    </div>
  )
}

export default FilterListPanel
