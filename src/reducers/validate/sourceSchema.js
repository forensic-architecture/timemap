import Joi from 'joi'

const sourceSchema = Joi.object().keys({
  id: Joi.string().required(),
  title: Joi.string().allow(''),
  thumbnail: Joi.string().allow(''),
  paths: Joi.array().required(),
  type: Joi.string().allow(''),
  affil_s: Joi.array().allow(''),
  url: Joi.string().allow(''),
  description: Joi.string().allow(''),
  parent: Joi.string().allow(''),
  author: Joi.string().allow(''),
  date: Joi.string().allow(''),
  notes: Joi.string().allow('')
})

export default sourceSchema
