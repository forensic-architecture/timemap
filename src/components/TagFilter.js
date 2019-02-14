import React from 'react'
import Checkbox from './presentational/Checkbox'

function TagFilter (props) {
  function isActive () {
    if (props.isCategory) {
      return props.categoryFilters.includes(props.tag.id)
    }
    return props.tagFilters.includes(props.tag.id)
  }

  function onClickTag () {
    if (isActive()) {
      props.filter({
        tags: props.tagFilters.filter(element => element !== props.tag.id)
      })
    } else {
      props.filter({
        tags: props.tagFilters.concat(props.tag.id)
      })
    }
  }

  function onClickCategory () {
    if (isActive()) {
      props.filter({
        categories: props.categoryFilters.filter(element => element !== props.tag.id)
      })
    } else {
      props.filter({
        categories: props.categoryFilters.concat(props.tag.id)
      })
    }
  }

  function renderTag () {
    const tag = props.tag
    let classes = (isActive()) ? 'tag-filter active' : 'tag-filter'
    let label = `${tag.name} ( ${tag.mentions} )`
    if (props.isShowTree) {
      label = `${tag.group} > ${tag.subgroup} > ${tag.name} ( ${tag.mentions} )`
    }
    return (
      <li
        key={props.tag.id}
        className={classes}
      >
        <Checkbox
          isActive={isActive()}
          label={label}
          onClickCheckbox={() => onClickTag()}
        />
      </li>
    )
  }

  function renderCategory () {
    const category = props.categories[props.tag.id]
    let classes = (isActive()) ? 'tag-filter active' : 'tag-filter'

    if (category) {
      return (
        <li
          key={props.tag.id}
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
  return (renderTag())
}

export default TagFilter
