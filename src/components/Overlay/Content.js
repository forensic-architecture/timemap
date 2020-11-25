import React from 'react'
import { Player } from 'video-react'
import Img from 'react-image'
import Md from './Md'
import Spinner from '../presentational/Spinner'
import NoSource from '../presentational/NoSource'

export default ({ media, viewIdx, translations, switchLanguage, langIdx }) => {
  const el = document.querySelector(`.source-media-gallery`)
  const shiftW = el ? el.getBoundingClientRect().width : 0

  function renderMedia (media) {
    let { path, type, poster } = media
    switch (type) {
      case 'Image':
        return (
          <div className='source-image-container'>
            <Img
              className='source-image'
              src={path}
              loader={<div className='source-image-loader'><Spinner /></div>}
              unloader={<NoSource failedUrls={[ path ]} />}
              onClick={() => window.open(path, '_blank')}
            />
          </div>
        )
      case 'Video':
        return (
          <div className='media-player'>
            <div className='banner-trans right-overlay'>
              {translations ? translations.map((trans, idx) => (
                langIdx !== idx + 1 ? (
                  <div className='trans-button' onClick={() => switchLanguage(idx + 1)}>{trans.code}</div>
                ) : (
                  <div className='trans-button' onClick={() => switchLanguage(0)}>EN</div>
                )
              )) : null}
            </div>
            <Player
              poster={poster}
              className='source-video'
              playsInline
              src={path}
            />
          </div>
        )
      case 'Text':
        return (
          <div className='source-text-container'>
            <Md
              path={path}
              loader={<Spinner />}
              unloader={() => this.renderError()}
            />
          </div>
        )
      case 'Document':
        return (
          <iframe className='source-document' src={path} />
        )
      default:
        return (
          <NoSource failedUrls={[`Application does not support extension: ${path.split('.')[1]}`]} />
        )
    }
  }

  return (
    <div
      className='source-media-gallery'
      style={{ transform: `translate(${viewIdx * -shiftW}px)` }}
    >
      {media.map((m) => renderMedia(m))}
    </div>
  )
}
