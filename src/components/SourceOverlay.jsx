import React from 'react'
import Img from 'react-image'
import { Player } from 'video-react'
import Md from './Md.jsx'
import Spinner from './presentational/Spinner'
import NoSource from './presentational/NoSource'
// TODO: move render functions into presentational components

class SourceOverlay extends React.Component {
  constructor () {
    super()

    this.state = {
      idx: 0
    }
  }

  renderError () {
    return (
      <NoSource failedUrls={['NOT ALL SOURCES AVAILABLE IN APPLICATION YET']} />
    )
  }

  renderImage (path) {
    return (
      <div className='source-image-container'>
        <Img
          className='source-image'
          src={path}
          loader={<div style={{ width: '400px', height: '400px' }}><Spinner /></div>}
          unloader={<NoSource failedUrls={this.props.source.paths} />}
        />
      </div>
    )
  }

  renderVideo (path) {
    // NB: assume only one video
    return (
      <div className='media-player'>
        <Player
          className='source-video'
          playsInline
          src={path}
        />
      </div>
    )
  }

  renderText (path) {
    return (
      <div className='source-text-container'>
        <Md
          path={path}
          loader={<Spinner />}
          unloader={() => this.renderError()}
        />
      </div>
    )
  }

  renderNoSupport (ext) {
    return (
      <NoSource failedUrls={[`Application does not support extension: ${ext}`]} />
    )
  }

  toMedia (path) {
    let type
    switch (true) {
      case /\.(png|jpg)$/.test(path):
        type = 'Image'; break
      case /\.(mp4)$/.test(path):
        type = 'Video'; break
      case /\.(md)$/.test(path):
        type = 'Text'; break
      default:
        type = 'Unknown'; break
    }
    return { type, path }
  }

  getTypeCounts (media) {
    let counts = { Image: 0, Video: 0, Text: 0 }
    media.forEach(m => {
      counts[m.type] += 1
    })
    return counts
  }

  _renderPath (media) {
    const { path, type } = media
    switch (type) {
      case 'Image':
        return this.renderImage(path)
      case 'Video':
        return this.renderVideo(path)
      case 'Text':
        return this.renderText(path)
      default:
        return this.renderNoSupport(path.split('.')[1])
    }
  }

  _renderCounts (counts) {
    const strFor = type =>
      counts[type] > 0
        ? `${counts[type]} ${type.toLowerCase()}${counts[type] > 1 ? 's' : ''}`
        : ''
    const img = strFor('Image')
    const vid = strFor('Video')
    const txt = strFor('Text')

    return (
      <div>
        {img || ''}
        {(img && vid) ? `, ${vid}` : (vid || '')}
        {((img || vid) && txt) ? `, ${txt}` : (txt || '')}
      </div>
    )
  }

  _renderContent (media) {
    const el = document.querySelector(`.source-media-gallery`)
    const shiftW = (el) ? el.getBoundingClientRect().width : 0
    return (
      <div className='source-media-gallery' style={{ transition: 'transform 0.2s ease', transform: `translate(${this.state.idx * -shiftW}px)` }}>
        {media.map((m) => this._renderPath(m))}
      </div>
    )
  }

  onShiftGallery (shift) {
    if (this.state.idx === 0 && shift === -1) return
    if (this.state.idx - 1 === this.props.source.paths.length && shift === 1) return
    this.setState({ idx: this.state.idx + shift })
  }

  _renderControls () {
    if (this.props.source.paths.length > 1) {
      return (
        <div className='media-gallery-controls'>
          <div className='back' onClick={() => this.onShiftGallery(-1)}><svg><path d='M0,-7.847549217020565L6.796176979388489,3.9237746085102825L-6.796176979388489,3.9237746085102825Z' /></svg></div>
          <div className='next' onClick={() => this.onShiftGallery(1)}><svg><path d='M0,-7.847549217020565L6.796176979388489,3.9237746085102825L-6.796176979388489,3.9237746085102825Z' /></svg></div>
        </div>
      )
    }
    return (
      <div className='media-gallery-controls' />
    )
  }

  render () {
    if (typeof (this.props.source) !== 'object') {
      return this.renderError()
    }
    const { url, title, paths, date, type, desc } = this.props.source
    const media = paths.map(this.toMedia)

    return (
      <div className='mo-overlay' onClick={this.props.onCancel}>
        <div className='mo-container' onClick={(e) => { e.stopPropagation() }}>
          <div className='mo-header'>
            <div className='mo-header-close' onClick={this.props.onCancel}>
              <button className='side-menu-burg is-active'><span /></button>
            </div>
            <div className='mo-header-text'>{this.props.source.title}</div>
          </div>
          <div className='mo-media-container'>
            {this._renderContent(media)}
            {this._renderControls()}
          </div>
          <div className='mo-meta-container'>
            <div className='mo-box-title'>
              {/* <p>{`${this.state.idx+1} / ${paths.length}`}</p> */}
              {title ? <p><b>{title}</b></p> : null}
              <div>{desc}</div>
            </div>

            <div className='mo-box'>
              <div>
                {type ? <h4>Media type</h4> : null}
                {type ? <p><i className='material-icons left'>perm_media</i>{type}</p> : null}
              </div>
              <div>
                {date ? <h4>Date</h4> : null}
                {date ? <p><i className='material-icons left'>today</i>{date}</p> : null}
              </div>
              <div>
                {url ? <h4>Link</h4> : null}
                {url ? <span><i className='material-icons left'>link</i><a href={url} target='_blank'>Link to original URL</a></span> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SourceOverlay
