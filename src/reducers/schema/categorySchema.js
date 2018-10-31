import Joi from 'joi';

const categorySchema = Joi.object().keys({
  category:         Joi.string().required(),
  category_label:   Joi.string().allow('').required(),
  group:            Joi.string(),
  group_label:      Joi.string(),
});

const optionalSchema = categorySchema.optionalKeys('group', 'group_label');

export default categorySchema;
