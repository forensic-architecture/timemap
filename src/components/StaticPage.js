import React from 'react'

export default ({ showing, children }) => {
  return (
    <div className={`cover-container ${showing ? 'showing' : ''}`}>
      {children}
    </div>
  )
}
