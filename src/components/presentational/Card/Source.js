import React from 'react'
import Img from 'react-image'
import Spinner from '../Spinner'
import { typeForPath } from '../../../common/utilities'

const CardSource = ({ source, isLoading, onClickHandler }) => {
  function renderIconText (type) {
    switch (type) {
      case 'Eyewitness Testimony':
        return 'visibility'
      case 'Government Data':
        return 'public'
      case 'Satellite Imagery':
        return 'satellite'
      case 'Second-Hand Testimony':
        return 'visibility_off'
      case 'Video':
        return 'videocam'
      case 'Photo':
        return 'photo'
      case 'Photobook':
        return 'photo_album'
      case 'Document':
        return 'picture_as_pdf'
      default:
        return 'help'
    }
  }

  if (!source) {
    return (
      <div className='card-source'>
        <div>Error: this source was not found</div>
      </div>
    )
  }

  const isImgUrl = /\.(jpg|png)$/
  let thumbnail = source.thumbnail

  if (!thumbnail || thumbnail === '' || !thumbnail.match(isImgUrl)) {
    // default to first image in paths, null if no images
    const imgs = source.paths.filter(p => p.match(isImgUrl))
    thumbnail = imgs.length > 0 ? imgs[0] : null
  }

  if (source.type === '' && source.paths.length >= 1) {
    source.type = typeForPath(source.paths[0])
  }
  const fallbackIcon = (
    <i className='material-icons source-icon'>
      {renderIconText(source.type)}
    </i>
  )

  return (
    <div className='card-source'>
      {isLoading
        ? <Spinner />
        : (
          <div className='source-row' onClick={() => onClickHandler(source)}>
            {thumbnail ? (
              <Img
                className='source-icon'
                src={thumbnail}
                loader={<Spinner small />}
                unloader={fallbackIcon}
                width={30}
                height={30}
              />
            ) : fallbackIcon}
            <p>{source.title ? source.title : source.id}</p>
          </div>
        )}
    </div>
  )
}

export default CardSource
