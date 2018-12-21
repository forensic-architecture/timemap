import React from 'react'
import Img from 'react-image'
import { Media, Player, controls } from 'react-media-player'
import Spinner from './presentational/Spinner'
import NoSource from './presentational/NoSource'

class SourceOverlay extends React.Component {
  constructor(props) {
    super(props)
    this.renderPhoto = this.renderPhoto.bind(this)
  }

  renderVideo() {
    // return (
    //   <iframe
    //     className="vimeo-iframe"
    //     src="https://player.vimeo.com/video/33044546"
    //     frameborder="0"
    //     webkitallowfullscreen
    //     mozallowfullscreen
    //     allowfullscreen
    //   ></iframe>
    // )
    return (
      <Media>
        <div className="media">
          <div className="media-player">
            <Player src="https://player.vimeo.com/video/33044546" />
          </div>
          <div className="media-controls">
            <controls.PlayPause/>
            <controls.MuteUnmute/>
          </div>
        </div>
      </Media>
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
      <div>ERROR: no support for this source</div>
    )
  }

  renderTestimony() {
    return (
      <div>Eyewitness</div>
    )
  }

  _renderSwitch() {
    console.table(this.props.source)
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
              {url ? <div><a href={url} target="_blank">Link to original webpage</a></div> : null}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SourceOverlay
