import React from 'react'

class MediaOverlay extends React.Component {
  render() {
    return (
      <div className="mo-overlay">
        <div className="mo-container" onClick={this.props.onCancel}>
          <div className="mo-media-container">
            <iframe
              className="vimeo-iframe"
              src="https://player.vimeo.com/video/33044546"
              frameborder="0"
              webkitallowfullscreen
              mozallowfullscreen
              allowfullscreen
            ></iframe>
          </div>
          {/* <div className="mo-controls"> */}
          {/*   ciao ciao */}
          {/* </div> */}
        </div>
      </div>
    )
  }
}

export default MediaOverlay
