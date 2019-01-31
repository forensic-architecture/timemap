import Joi from 'joi'

const siteSchema = Joi.object().keys({
  id: Joi.string().required(),
  description: Joi.string().allow('').required(),
  site: Joi.string().required(),
  latitude: Joi.string().required(),
  longitude: Joi.string().required(),
  enabled: Joi.string().allow('')
})

export default siteSchema
