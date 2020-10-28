import React from 'react'
import marked from 'marked'

export default ({
  content = [],
  styles = {},
  isOpen = true,
  onClose,
  title,
  theme = 'light'
}) => (
  <div>
    <div className={`infopopup ${isOpen ? '' : 'hidden'} ${theme === 'dark' ? 'dark' : 'light'}`} style={styles}>
      <div className='legend-header'>
        <button onClick={onClose} className='side-menu-burg over-white is-active'><span /></button>
        <h2>{title}</h2>
      </div>
      {content.map(t => <div dangerouslySetInnerHTML={{ __html: marked(t) }} />)}
    </div>
  </div>
)
