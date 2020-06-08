import React from 'react'

import copy from '../../../common/data/copy.json'

const CardFilters = ({ filters, language }) => {
  const filtersLang = copy[language].cardstack.filters
  const noFiltersLang = copy[language].cardstack.nofilters

  if (filters.length > 0) {
    return (
      <div className='card-row card-cell filters'>
        <h4>{filtersLang}:</h4>
        <p>
          {filters.map((filter, idx) => {
            return (
              <span className='filter'>
                <small>{filter.name}</small>
                {(idx < filters.length - 1)
                  ? ','
                  : ''}
              </span>
            )
          })}
        </p>
      </div>
    )
  }
  return (
    <div className='card-row card-cell filters'>
      <h4>{filtersLang}</h4>
      <p><small>{noFiltersLang}</small></p>
    </div>
  )
}

export default CardFilters
