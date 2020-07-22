import Joi from 'joi'

function joiFromCustom (custom) {
  const output = {}
  custom.forEach(field => {
    if (field.kind === 'text' || field.kind === 'link') {
      output[field.key] = Joi.string().allow('')
    }
  })
  return output
}

function createEventSchema (custom) {
  return Joi.object().keys({
    id: Joi.string().allow(''),
    description: Joi.string().allow('').required(),
    date: Joi.string().allow(''),
    time: Joi.string().allow(''),
    time_precision: Joi.string().allow(''),
    location: Joi.string().allow(''),
    latitude: Joi.string().allow(''),
    longitude: Joi.string().allow(''),
    type: Joi.string().allow(''),
    category: Joi.string().allow(''),
    category_full: Joi.string().allow(''),
    narratives: Joi.array(),
    sources: Joi.array(),
    filters: Joi.array().allow(''),
    tags: Joi.array().allow(''),
    comments: Joi.string().allow(''),
    time_display: Joi.string().allow(''),
    // nested
    narrative___stepStyles: Joi.array(),
    shape: Joi.string().allow(''),
    colour: Joi.string().allow(''),
    ...joiFromCustom(custom)
  })
    .and('latitude', 'longitude')
    .or('date', 'latitude')
}

export default createEventSchema
