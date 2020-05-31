import Joi from 'joi'

const eventSchema = Joi.object().keys({
  id: Joi.string().required(),
  description: Joi.string().allow('').required(),
  date: Joi.string().allow(''),
  time: Joi.string().allow(''),
  time_precision: Joi.string().allow(''),
  location: Joi.string().allow(''),
  latitude: Joi.string().allow(''),
  longitude: Joi.string().allow(''),
  type: Joi.string().allow(''),
  category: Joi.string().required(),
  category_full: Joi.string().allow(''),
  narratives: Joi.array(),
  sources: Joi.array(),
  tags: Joi.array().allow(''),
  comments: Joi.string().allow(''),
  time_display: Joi.string().allow(''),

  // nested
  narrative___stepStyles: Joi.array(),
  shape: Joi.string().allow(''),
  colour: Joi.string().allow('')
})
  .and('latitude', 'longitude')
  .or('date', 'latitude')

export default eventSchema
