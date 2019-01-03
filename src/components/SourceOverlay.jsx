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
    this.renderPhotobook = this.renderPhotobook.bind(this)
    this.renderTestimony = this.renderTestimony.bind(this)
  }

  renderVideo() {
    // NB: assume only one video
    return (
      <div className="media-player">
        <Player
          className='source-video'
          playsInline
          src={this.props.source.paths[0]}
        />
      </div>
    )
  }

  renderPhoto() {
    return (
      <div className='source-image-container'>
        <Img
          className='source-image'
          src={this.props.source.paths}
          loader={<Spinner />}
          unloader={<NoSource failedUrls={this.props.source.paths} />}
        />
      </div>
    )
  }

  renderPhotobook() {
    return (
      <div className='source-image-container'>
        {this.props.source.paths.map((url, idx) => (
          <Img
            key={idx}
            className='source-image'
            src={url}
            loader={<Spinner />}
            unloader={<NoSource failedUrls={[this.props.source.path]} />}
          />

        ))}
      </div>
    )
  }

  renderError() {
    return (
      <NoSource failedUrls={["NOT ALL SOURCES AVAILABLE IN APPLICATION YET"]} />
    )
  }

  renderNoSupport(ext) {
    return (
      <NoSource failedUrls={[`Application does not support this extension: ${ext}`]} />
    )
  }

  renderTestimony() {
    return (
      <div>
        <a href={`${this.props.source.path}.docx`}>Download Testimony</a>
      </div>
    )
  }

  _renderPath(path) {
    // render conditionally based on the extension
    switch (true) {
      case /\.(png|jpg)$/.test(path):
        console.log('image')
        return <div>{path}</div>
      case /\.(mp4)$/.test(path):
        console.log('video')
        return <div>{path}</div>
      case /\.(md)$/.test(path):
        console.log('text')
        return <div>{path}</div>
      default:
        console.log('unsupported extension')
        return this.renderNoSupport(path.split('.')[1])
    }
  }

  _renderContent() {
    return (
      <div className='media-content'>
        {this.props.source.paths.map(this._renderPath)}
      </div>
    )
    // switch(this.props.source.type) {
    //   case 'Video':
    //     return this.renderVideo()
    //   case 'Photo':
    //     return this.renderPhoto()
    //   case 'Photobook':
    //     return this.renderPhotobook()
    //   case 'Eyewitness Testimony':
    //     return this.renderTestimony()
    //   default:
    //     return this.renderError()
    // }
  }

  render() {
    if (typeof(this.props.source) !== 'object') {
      return this.renderError()
    }
    const {id, url, title, date, type, affil_1, affil_2} = this.props.source
    return (
      <div className="mo-overlay">
        <div className="mo-container">
          <div className="mo-header">
            <div className="mo-header-close" onClick={this.props.onCancel}>
              <button className="side-menu-burg is-active"><span></span></button>
            </div>
            <div className="mo-header-text">{this.props.source.id}</div>
          </div>
          <div className="mo-media-container">
            {this._renderContent()}
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
