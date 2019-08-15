import React from 'react'
import Content from './Content'
import Controls from './Controls'
import { selectTypeFromPathWithPoster } from '../../common/utilities'

class SourceOverlay extends React.Component {
  constructor () {
    super()
    this.state = { mediaIdx: 0, transIdx: 0 }
    this.onShiftGallery = this.onShiftGallery.bind(this)
  }

  getTypeCounts (media) {
    return media.reduce(
      (acc, vl) => {
        acc[vl.type] += 1
        return acc
      },
      { Image: 0, Video: 0, Text: 0 }
    )
  }

  onShiftGallery (shift) {
    // no more left
    if (this.state.mediaIdx === 0 && shift === -1) return
    // no more right
    if (this.state.mediaIdx === this.props.source.paths.length - 1 && shift === 1) return
    this.setState({ mediaIdx: this.state.mediaIdx + shift })
  }

  switchToTrans (idx) {
    this.setState({ transIdx: idx })
  }

  renderContent (source) {
    const { url, title, paths, date, type, desc, poster } = source
    const shortenedTitle = title.substring(0, 100)
    return (
      <React.Fragment>
        <div className='mo-banner'>
          <div className='mo-banner-close' onClick={this.props.onCancel}>
            <i className='material-icons'>close</i>
          </div>

          <h3 className='mo-banner-content'>{shortenedTitle}</h3>

          <div className='mo-banner-trans'>
            {this.props.translations ? this.props.translations.map((trans, idx) => (
              this.state.transIdx !== idx + 1 ? (
                <div className='mo-trans' onClick={() => this.switchToTrans(idx + 1)}>{trans.code}</div>
              ) : (
                <div className='mo-trans' onClick={() => this.switchToTrans(0)}>EN</div>
              )
            )) : null}
          </div>
        </div>
        <div className='mo-container' onClick={e => e.stopPropagation()}>
          <div className='mo-media-container'>
            <Content media={paths.map(p => selectTypeFromPathWithPoster(p, poster))} viewmediaIdx={this.state.mediaIdx} />
          </div>
        </div>

        <div className='mo-footer'>
          <Controls paths={paths} viewmediaIdx={this.state.mediaIdx} onShiftHandler={this.onShiftGallery} />

          <div className='mo-meta-container'>
            <div className='mo-box-title'>
              <div>{desc}</div>
            </div>

            {(type || date || url) ? (
              <div className='mo-box'>
                <div>
                  {type ? <h4>Evidence type</h4> : null}
                  {type ? <p><i className='material-icons left'>perm_media</i>{type}</p> : null}
                </div>
                <div>
                  {date ? <h4>Date Published</h4> : null}
                  {date ? <p><i className='material-icons left'>today</i>{date}</p> : null}
                </div>
                <div>
                  {url ? <h4>Link</h4> : null}
                  {url ? <span><i className='material-icons left'>link</i><a href={url} target='_blank'>Link to original URL</a></span> : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </React.Fragment>
    )
  }

  render () {
    if (typeof (this.props.source) !== 'object') {
      return this.renderError()
    }
    const { transIdx } = this.state

    return (
      <div className={`mo-overlay ${this.props.opaque ? 'opaque' : ''}`}>
        {this.renderContent(transIdx === 0 ? this.props.source : this.props.translations[transIdx - 1])}
      </div>
    )
  }
}

export default SourceOverlay
