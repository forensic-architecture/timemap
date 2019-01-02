import React from 'react';

const NoSource = ({ failedUrls  }) => {
  return (
    <div className="no-source-container">
      <div className="no-source-row">
        <i className="material-icons no-source-icon">
          error
        </i>
        <div>No media found, as the original media has not yet been uploaded to the platform.</div>
      </div>
    </div>
  )
}

export default NoSource;
