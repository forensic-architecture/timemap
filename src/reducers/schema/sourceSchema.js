import Joi from 'joi';

const sourceSchema = Joi.object().keys({
  id:             Joi.string().required(),
  path:           Joi.string().required(),
  type:           Joi.string().allow(''),
  affil_1:        Joi.string().allow(''),
  affil_2:        Joi.string().allow(''),
  url:            Joi.string().allow(''),
  title:          Joi.string().allow(''),
  parent:         Joi.string().allow(''),
  author:         Joi.string().allow(''),
  date:           Joi.string().allow(''),
  notes:          Joi.string().allow('')
});

export default sourceSchema;
