import React from 'react'

class SourceOverlay extends React.Component {


  renderVideo() {
    <iframe
      className="vimeo-iframe"
      src="https://player.vimeo.com/video/33044546"
      frameborder="0"
      webkitallowfullscreen
      mozallowfullscreen
      allowfullscreen
    ></iframe>
  }

  renderImage() {
    console.log(this.props.source)
    return (
      <div>This is the image</div>
    )
  }

  renderError() {
    return (
      <div>ERROR: no support for this sourcee</div>
    )
  }

  _renderSwitch() {
    switch(this.props.source.type) {
      case 'Video':
        return this.renderVideo()
      case 'Photo':
        return this.renderImage()
      default:
        return this.renderError()
    }
  }

  render() {
    return (
      <div className="mo-overlay">
        <div className="mo-container" onClick={this.props.onCancel}>
          <div className="mo-media-container">
            {this._renderSwitch()}
          </div>
        </div>
      </div>
    )
  }
}

export default SourceOverlay
