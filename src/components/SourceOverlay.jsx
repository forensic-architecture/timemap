import React from 'react'
import Img from 'react-image'
import { Player } from 'video-react'
import Spinner from './presentational/Spinner'
import NoSource from './presentational/NoSource'

class SourceOverlay extends React.Component {
  constructor(props) {
    super(props)
    this.renderVideo = this.renderVideo.bind(this)
    this.renderPhoto = this.renderPhoto.bind(this)
  }

  renderPlaceholder() {
    return (
      <NoSource failedUrls={["NOT ALL SOURCES AVAILABLE IN APPLICATION YET"]} />
    )
  }

  renderVideo() {
    return (
      <div className="media-player">
        <Player
          playsInline
          src={`${this.props.source.path}.mp4`}
        />
      </div>
    )
  }

  renderPhoto() {
    const imageExts = ['.jpg', '.png']
    const possibleUrls = imageExts.map(ext => `${this.props.source.path}${ext}`)
    return (
      <Img
        src={possibleUrls}
        loader={<Spinner />}
        unloader={<NoSource failedUrls={possibleUrls} />}
      />
    )
  }

  renderError() {
    return (
      <NoSource failedUrls={["NOT ALL SOURCES AVAILABLE IN APPLICATION YET"]} />
    )
  }

  renderTestimony() {
    return (
      <div>Eyewitness</div>
    )
  }

  _renderSwitch() {
    // console.table(this.props.source)
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
    if (typeof(this.props.source) !== 'object') {
      return this.renderPlaceholder();
    }
    const {id, url, title, date, type, affil_1, affil_2} = this.props.source
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
          <div className="mo-meta-container">
            <div className="mo-box">
              {id ? <div><b>{id}</b></div> : null}
              {title? <div><b>{title}</b></div> : null}
              <hr/>
              {type ? <div>Type: <span className="indent">{type}</span></div> : null}
              {date ? <div>Date:<span className="indent">{date}</span></div> : null}
              <hr/>
              {url ? <div><a href={url} target="_blank">Link to original URL</a></div> : null}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SourceOverlay
