import Joi from 'joi'

const narrativeSchema = Joi.object().keys({
  id: Joi.string().required(),
  description: Joi.string().allow('').required(),
  label: Joi.string().required()
})

export default narrativeSchema
