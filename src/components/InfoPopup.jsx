import React from 'react'
import marked from 'marked'
import copy from '../common/data/copy.json'

export default ({ ui, app, methods }) => {
  function renderIntro () {
    var introCopy = copy[app.language].legend.default.intro
    if (process.env.store.text && process.env.store.text.introCopy) introCopy = process.env.store.text.introCopy
    return introCopy.map(txt => <p dangerouslySetInnerHTML={{ __html: marked(txt) }} />)
  }

  function renderHalfWithDot () {
    // extract category colors from store for combined display.
    const categoryKeys = Object.keys(ui.style.categories)
    let firstFill = 'red'
    let secondFill = 'blue'
    if (categoryKeys.length >= 1) {
      firstFill = ui.style.categories[categoryKeys[0]]
    }
    if (categoryKeys.length >= 2) {
      secondFill = ui.style.categories[categoryKeys[1]]
    }

    return [
      <style>{`.svg-demo { max-width: 30px } .first { fill: ${firstFill} } .second { fill: ${secondFill} } .demo-text { font-size: 9pt; color: white; font-weight:900 }`}</style>,
      <svg viewBox='0 0 30 30' className='svg-demo'>
        <g className='location demo-element' transform='translate(15,15)'>
          <path className='location-event-marker first' id='arc_0' d='M 10 0 A 10 10 0 0 1 -10 1.2246467991473533e-15 L 0 0  L 10 0 Z' />
          <path class='location-event-marker second' id='arc_1' d='M -10 1.2246467991473533e-15 A 10 10 0 0 1 10 -2.4492935982947065e-15 L 0 0  L -10 1.2246467991473533e-15 Z' />
          <text class='location-count demo-text' dx='-4' dy='4'>2</text>
        </g>
      </svg>
    ]
  }

  function renderCategoryColors () {
    const categories = Object.keys(ui.style.categories).filter(label => label !== 'default')
    categories.reverse()
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

  function renderArrow (strokeFill) {
    return (
      <svg x='-10px' y='0px' width='100px' height='30px' viewBox='0 40 100 30' enableBackground='new 0 0 100 70'>
        <polyline fill='none' stroke={strokeFill} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' stroke-miterlimit='10' points='
          8.376,63.723 47.287,63.723 60,46 80,46 ' />
        {/* <line stroke={strokeFill} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' x1='33.723' y1='59.663' x2='39.069' y2='63.723' /> */}
        {/* <line stroke={strokeFill} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' x1='33.723' y1='67.782' x2='39.069' y2='63.723' /> */}
        <line stroke={strokeFill} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' x1='78.849' y1='41.94' x2='84.195' y2='46' />
        <line stroke={strokeFill} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' x1='78.849' y1='50.06' x2='84.195' y2='46' />
      </svg>
    )
  }

  function renderView2DLegend () {
    return (
      <div className={`infopopup ${(app.flags.isInfopopup) ? '' : 'hidden'}`}>
        <div className='legend-header'>
          <button onClick={methods.onClose} className='side-menu-burg over-white is-active'><span /></button>
          <h2>{copy[app.language].legend.default.header}</h2>
        </div>
        {renderIntro()}
        <div>
          {renderCategoryColors()}
        </div>
        <br />
        <div className='legend'>
          <div className='legend-container'>
            <div className='legend-item one'>
              {renderHalfWithDot()}
            </div>
            <div className='legend-item three'>
              {copy[app.language].legend.default.notation}
            </div>
          </div>
        </div>
        <br />
        <div>
          <p>{copy[app.language].legend.default.arrows}</p>
        </div>

        {
          ui.style.arrows ? (

            Object.keys(ui.style.arrows).map(arrowName => (
              <div className='legend-section'>
                {renderArrow(ui.style.arrows[arrowName])}
                <div className='legend-labels'>
                  <div className='label'>{arrowName}</div>
                </div>
              </div>
            ))
          ) : null
        }

      </div>
    )
  }

  return (
    <div>{renderView2DLegend()}</div>
  )
}
