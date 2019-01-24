import React from 'react'
import Checkbox from './presentational/Checkbox'

class TagFilter extends React.Component {
  isActive () {
    if (this.props.isCategory) {
      return this.props.categoryFilters.includes(this.props.tag.id)
    }
    return this.props.tagFilters.includes(this.props.tag.id)
  }

  onClickTag () {
    if (this.isActive()) {
      this.props.filter({
        tags: this.props.tagFilters.filter(element => element !== this.props.tag.id)
      })
    } else {
      this.props.filter({
        tags: this.props.tagFilters.concat(this.props.tag.id)
      })
    }
  }

  onClickCategory () {
    if (this.isActive()) {
      this.props.filter({
        categories: this.props.categoryFilters.filter(element => element !== this.props.tag.id)
      })
    } else {
      this.props.filter({
        categories: this.props.categoryFilters.concat(this.props.tag.id)
      })
    }
  }

  renderTag () {
    const tag = this.props.tag
    let classes = (this.isActive()) ? 'tag-filter active' : 'tag-filter'
    let label = `${tag.name} ( ${tag.mentions} )`
    if (this.props.isShowTree) {
      label = `${tag.group} > ${tag.subgroup} > ${tag.name} ( ${tag.mentions} )`
    }
    return (
      <li
        key={this.props.tag.id}
        className={classes}
      >
        <Checkbox
          isActive={this.isActive()}
          label={label}
          onClickCheckbox={() => this.onClickTag()}
        />
      </li>
    )
  }

  renderCategory () {
    const category = this.props.categories[this.props.tag.id]
    let classes = (this.isActive()) ? 'tag-filter active' : 'tag-filter'

    if (category) {
      return (
        <li
          key={this.props.tag.id}
          className={classes}
        >
          <Checkbox
            isActive={this.isActive()}
            label={`${category.name} ( ${category.counts} )`}
            onClickCheckbox={() => this.onClickCategory()}
          />
        </li>
      )
    }
    return (<div />)
  }

  render () {
    if (this.props.isCategory) return (this.renderCategory())
    return (this.renderTag())
  }
}

export default TagFilter
