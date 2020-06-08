import React from 'react'
import Checkbox from '../presentational/Checkbox'

function SelectFilter (props) {
  function isActive () {
    if (props.isCategory) {
      return props.categoryFilters.includes(props.filter.id)
    }
    return props.filterFilters.includes(props.filter.id)
  }

  function onClickFilter () {
    if (isActive()) {
      props.filter({
        filters: props.filterFilters.filter(element => element !== props.filter.id)
      })
    } else {
      props.filter({
        filters: props.filterFilters.concat(props.filter.id)
      })
    }
  }

  function onClickCategory () {
    if (isActive()) {
      props.filter({
        categories: props.categoryFilters.filter(element => element !== props.filter.id)
      })
    } else {
      props.filter({
        categories: props.categoryFilters.concat(props.filter.id)
      })
    }
  }

  function renderFilter () {
    const filter = props.filter
    let classes = (isActive()) ? 'filter-filter active' : 'filter-filter'
    let label = `${filter.name} ( ${filter.mentions} )`
    if (props.isShowTree) {
      label = `${filter.group} > ${filter.subgroup} > ${filter.name} ( ${filter.mentions} )`
    }
    return (
      <li
        key={props.filter.id}
        className={classes}
      >
        <Checkbox
          isActive={isActive()}
          label={label}
          onClickCheckbox={() => onClickFilter()}
        />
      </li>
    )
  }

  function renderCategory () {
    const category = props.categories[props.filter.id]
    let classes = (isActive()) ? 'filter-filter active' : 'filter-filter'

    if (category) {
      return (
        <li
          key={props.filter.id}
          className={classes}
        >
          <Checkbox
            isActive={isActive()}
            label={`${category.name} ( ${category.counts} )`}
            onClickCheckbox={onClickCategory}
          />
        </li>
      )
    }
    return (<div />)
  }

  if (props.isCategory) return (renderCategory())
  return (renderFilter())
}

export default SelectFilter
