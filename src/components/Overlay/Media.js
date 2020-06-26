import React from 'react'
import marked from 'marked'
import Content from './Content'
import Controls from './Controls'
import { selectTypeFromPathWithPoster } from '../../common/utilities'

/*
 * Inside the SourceOverlay, both the currently displaying media and language
 * can be changed by the user. These are both managed in this component's React
 * state.
 */
class SourceOverlay extends React.Component {
  constructor () {
    super()
    this.state = { mediaIdx: 0, langIdx: 0 }
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

  switchLanguage (idx) {
    this.setState({ langIdx: idx })
  }

  renderContent (source) {
    const { url, title, paths, date, type, poster, description } = source
    const shortenedTitle = title.substring(0, 100)
    return (
      <React.Fragment>
        <div className='mo-banner'>
          <div className='mo-banner-close' onClick={this.props.onCancel}>
            <i className='material-icons'>close</i>
          </div>

          <h3 className='mo-banner-content'>{shortenedTitle}</h3>

        </div>
        <div className='mo-container' onClick={e => e.stopPropagation()}>
          <div className='mo-media-container'>
            <Content
              switchLanguage={(lang) => this.switchLanguage(lang)}
              translations={this.props.translations}
              langIdx={this.state.langIdx}
              media={paths.map(p => selectTypeFromPathWithPoster(p, poster))}
              viewIdx={this.state.mediaIdx}
            />
          </div>
        </div>

        <div className='mo-footer'>
          <Controls paths={paths} viewIdx={this.state.mediaIdx} onShiftHandler={this.onShiftGallery} />

          <div className='mo-meta-container'>
            {description ? <div className='mo-box-desc'>
              <div className='md-container' dangerouslySetInnerHTML={{ __html: marked(description) }} />
            </div> : null}

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

  renderIntlContent () {
    const { langIdx } = this.state
    const { translations, source } = this.props
    let translated = null
    if (translations && translations.length && langIdx > 0) {
      translated = translations[langIdx - 1]
    }
    if (translated) {
      translated = {
        ...translated,
        poster: source.poster,
        // NOTE: this is to allow a slightly nicer syntax when using the Media
        // overlay in cover videos.
        paths: translated.file ? [translated.file] : translated.paths
      }
    }

    return this.renderContent(langIdx === 0 ? source : translated)
  }

  render () {
    if (typeof (this.props.source) !== 'object') {
      return this.renderError()
    }

    return (
      <div className={`mo-overlay ${this.props.opaque ? 'opaque' : ''}`}>
        {this.renderIntlContent()}
      </div>
    )
  }
}

export default SourceOverlay
