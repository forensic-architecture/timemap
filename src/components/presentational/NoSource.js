import React from 'react'

const NoSource = ({ failedUrls }) => {
  return (
    <div className='no-source-container'>
      <div className='no-source-row'>
        <p>
          <i className='material-icons no-source-icon'>error</i>
        </p>
        <p>No media found, as the original media has not yet been uploaded to the platform.</p>
      </div>
    </div>
  )
}

export default NoSource
