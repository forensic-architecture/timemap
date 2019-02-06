import React from 'react'
import Checkbox from './presentational/Checkbox'
import copy from '../js/data/copy.json'

export default (props) => {
  function onClickCheckbox (obj, type) {
    obj.active = !obj.active
    props.onCategoryFilter(obj)
  }

  function renderCategoryTree () {
    return (
      <div>
        <h2>{copy[props.language].toolbar.categories}</h2>
        {props.categories.map(cat => {
          return (<li
            key={cat.category.replace(/ /g, '_')}
            className={'tag-filter active'}
            style={{ marginLeft: '20px' }}
          >
            <Checkbox
              label={cat.category}
              isActive={cat.active}
              onClickCheckbox={() => onClickCheckbox(cat, 'category')}
            />
          </li>)
        })}
      </div>
    )
  }

  return (
    <div className='react-innertabpanel'>
      <h2>{copy[props.language].toolbar.explore_by_category__title}</h2>
      <p>{copy[props.language].toolbar.explore_by_category__description}</p>
      {renderCategoryTree()}
    </div>
  )
}
