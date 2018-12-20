import React from 'react'
import Img from 'react-image'

class SourceOverlay extends React.Component {
  constructor(props) {
    super(props)
    this.renderPhoto = this.renderPhoto.bind(this)
  }

  renderVideo() {
    return (
      <iframe
        className="vimeo-iframe"
        src="https://player.vimeo.com/video/33044546"
        frameborder="0"
        webkitallowfullscreen
        mozallowfullscreen
        allowfullscreen
      ></iframe>
    )
  }

  renderPhoto() {
    const imageExts = ['.jpg', '.png']
    const possibleUrls = imageExts.map(ext => `${this.props.source.path}${ext}`)
    return (
      <div>
        <Img src={possibleUrls} />
      </div>
    )
  }

  renderError() {
    return (
      <div>ERROR: no support for this source</div>
    )
  }

  renderTestimony() {
    return (
      <div>Eyewitness</div>
    )
  }

  _renderSwitch() {
    switch(this.props.source.type) {
      case 'Video':
        return this.renderVideo()
      case 'Photo':
        return this.renderPhoto()
      case 'Eyewitness Testimony':
        return this.renderTestimony()
      default:
        return this.renderError()
    }
  }

  render() {
    return (
      <div className="mo-overlay">
        <div className="mo-container" onClick={this.props.onCancel}>
          <div className="mo-header">
            <div className="mo-header-close" onClick={this.props.onCancel}>
              <button className="side-menu-burg is-active"><span></span></button>
            </div>
            <div className="mo-header-text">{this.props.source.id}</div>
          </div>
          <div className="mo-media-container">
            {this._renderSwitch()}
          </div>
        </div>
      </div>
    )
  }
}

export default SourceOverlay
