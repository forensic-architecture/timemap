import Joi from 'joi'

const shapeSchema = Joi.object().keys({
  name: Joi.string().required(),
  items: Joi.array().required()
})

export default shapeSchema
