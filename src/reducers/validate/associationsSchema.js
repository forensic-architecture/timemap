import Joi from 'joi'

const associationsSchema = Joi.object().keys({
  id: Joi.string().allow('').required(),
  desc: Joi.string().allow(''),
  mode: Joi.string().allow('').required(),
  filter_paths: Joi.array()
})

export default associationsSchema
