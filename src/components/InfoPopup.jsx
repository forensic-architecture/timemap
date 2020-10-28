import React from 'react'
import Popup from './presentational/Popup'
import copy from '../common/data/copy.json'

export default ({ isOpen, onClose, language, dims }) => (
  <Popup
    title={copy[language].legend.default.header}
    content={copy[language].legend.default.intro}
    onClose={onClose}
    styles={{ bottom: dims.height }}
    isOpen={isOpen}
  />
)
