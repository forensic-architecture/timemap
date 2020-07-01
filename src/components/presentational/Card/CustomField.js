import React from 'react'
import marked from 'marked'

const CardCustomField = ({ field, value }) => (
  <div className='card-cell'>
    <p>
      <i className='material-icons left'>{field.icon}</i>
      <b>{field.title ? `${field.title}: ` : '- '}</b>
      {field.kind === 'text' ? value : marked(`[${value}](${field.value})`)}
    </p>
  </div>
)

export default CardCustomField
