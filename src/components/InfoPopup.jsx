import React from 'react';
import copy from '../js/data/copy.json';
// NB: should we make this componetn part of a future feature?

export default class InfoPopUp extends React.Component{

  renderView2DCopy() {
    return copy[this.props.app.language].legend.view2d.paragraphs.map(paragraph => <p>{paragraph}</p>);
  }

  renderCategoryColors() {
    const colors = copy[this.props.app.language].legend.view2d.colors.slice(0);
    colors.reverse();
    return (
      <div className="legend-labels" style={{ 'margin-left': '-10px' }}>
        {colors.map((color, idx) => {
          return (
            <div className="label" style={{ 'margin-left': `${idx*5}` }}>
              <div className={`color-category ${color.class}`}></div>
              {color.label}
            </div>
          )
        })}
      </div>
    )
  }

  renderView2DLegend() {
    return (
      <div className={`infopopup ${(this.props.app.flags.isInfopopup) ? '' : 'hidden'}`}>
        <button onClick={() => this.props.toggle()} className="side-menu-burg over-white is-active"><span /></button>
        {this.renderView2DCopy()}
        <div className="legend">
          <div className="legend-section" style={{ 'height': '100px' }}>
            <svg x="0px" y="0px" width="100px" height="100px" viewBox="0 0 100 100" enableBackground="new 0 0 100 100">
              <circle fill="#D2CD28" cx="50" cy="50" r="50"/>
              <circle fill="#662770" cx="50" cy="50" r="40"/>
              <circle fill="#2F409A" cx="50" cy="50" r="30"/>
              <circle fill="#256C36" cx="50" cy="50" r="20"/>
              <circle fill="#FF0000" cx="50" cy="50" r="10"/>
            </svg>
            {this.renderCategoryColors()}
          </div>
          <div className="legend-section">
            <svg x="0px" y="0px" width="100px" height="30px" viewBox="0 0 100 30" enableBackground="new 0 0 100 30">
              <line fill="none" stroke="#2F409A" strokeDasharray="4,4" x1="30" y1="15" x2="70" y2="15"/>
              <circle fill="2F409A" fillOpacity="0.2" stroke="#2F409A" strokeDasharray="4,4" cx="80" cy="15" r="10"/>
              <circle fill="2F409A" fillOpacity="0.2" stroke="#2F409A" strokeDasharray="4,4" cx="20" cy="15" r="10"/>
            </svg>
            <div className="legend-labels">
              <div className="label">Comunicaciones</div>
            </div>
          </div>
          <div className="legend-section">
            <svg x="0px" y="0px" width="100px" height="30px" viewBox="0 0 100 30" enableBackground="new 0 0 100 30">
              <circle opacity="0.3" fill="#FF0000" cx="50" cy="15" r="15"/>
            </svg>
            <div className="legend-labels">
              <div className="label">Ataques</div>
            </div>
          </div>
          <div className="legend-section">
            <svg x="0px" y="0px" width="100px" height="30px" viewBox="0 40 100 30" enableBackground="new 0 0 100 70">
              <polyline fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke-miterlimit="10" points="
                8.376,63.723 47.287,63.723 60,46 106,46 "/>
              <line stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" x1="33.723" y1="59.663" x2="39.069" y2="63.723"/>
              <line stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" x1="33.723" y1="67.782" x2="39.069" y2="63.723"/>
              <line stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" x1="78.849" y1="41.94" x2="84.195" y2="46"/>
              <line stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" x1="78.849" y1="50.06" x2="84.195" y2="46"/>
            </svg>
            <div className="legend-labels">
              <div className="label">Rutas de bus</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>{this.renderView2DLegend()}</div>
    )
  }
}
