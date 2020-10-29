import React from 'react'
import marked from 'marked'
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
            key={cat.id.replace(/ /g, '_')}
            className={'filter-filter active'}
            style={{ marginLeft: '20px' }}
          >
            <Checkbox
              label={cat.id}
              isActive={activeCategories.includes(cat.id)}
              onClickCheckbox={() => onCategoryFilter(cat.id)}
            />
          </li>)
        })}
      </div>
    )
  }

  return (
    <div className='react-innertabpanel'>
      <h2>{copy[language].toolbar.categories}</h2>
      <p dangerouslySetInnerHTML={{ __html: marked(copy[language].toolbar.explore_by_category__description) }} />
      {renderCategoryTree()}
    </div>
  )
}
