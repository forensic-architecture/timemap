import React from 'react'
import copy from '../js/data/copy.json'

export default ({ ui, app, methods }) => {
  function renderIntro () {
    return copy[app.language].legend.default.intro.map(txt => <p>{txt}</p>)
  }

  function renderCategoryColors () {
    const categories = Object.keys(ui.style.categories).filter(label => label !== 'default')

    return categories.map(category => (
      <div className='legend-section'>
        <svg x='0px' y='0px' width='50px' height='20px' viewBox='0 0 100 30' enableBackground='new 0 0 100 30'>
          <circle opacity='1' fill={ui.style.categories[category]} cx='50' cy='15' r='15' />
        </svg>
        <div className='legend-labels'>
          <div className='label'>{category}</div>
        </div>
      </div>
    ))
  }

  function renderView2DLegend () {
    return (
      <div className={`infopopup ${(app.flags.isInfopopup) ? '' : 'hidden'}`}>
        <div className='legend-header'>
          <button onClick={methods.onClose} className='side-menu-burg over-white is-active'><span /></button>
          <h2>{copy[app.language].legend.default.header}</h2>
        </div>
        {renderIntro()}
        <div className='legend'>
          <div className='legend-container'>
            {renderCategoryColors()}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>{renderView2DLegend()}</div>
  )
}
