import React from 'react'
import Checkbox from '../presentational/Checkbox'
import copy from '../../common/data/copy.json'

export default ({
  categories,
  activeCategories,
  onCategoryFilter,
  language
}) => {
  function renderCategoryTree () {
    return (
      <div>
        {categories.map(cat => {
          return (<li
            key={cat.category.replace(/ /g, '_')}
            className={'filter-filter active'}
            style={{ marginLeft: '20px' }}
          >
            <Checkbox
              label={cat.category}
              isActive={activeCategories.includes(cat.category)}
              onClickCheckbox={() => onCategoryFilter(cat.category)}
            />
          </li>)
        })}
      </div>
    )
  }

  return (
    <div className='react-innertabpanel'>
      <h2>{copy[language].toolbar.categories}</h2>
      <p>{copy[language].toolbar.explore_by_category__description}</p>
      {renderCategoryTree()}
    </div>
  )
}
