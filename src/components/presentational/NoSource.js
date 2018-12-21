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
      {/* <div className="no-source-row"> */}
      {/*   The following URLs were tried: */}
      {/* </div> */}
      {/* <ul> */}
      {/*   {failedUrls.map((url, idx) => <li key={idx}>{url}</li>)} */}
      {/* </ul> */}
    </div>
  )
}

export default NoSource;
