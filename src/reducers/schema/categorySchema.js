import Joi from 'joi'

const categorySchema = Joi.object().keys({
  category: Joi.string().required(),
  description: Joi.string(),
  group: Joi.string()
})

export default categorySchema
