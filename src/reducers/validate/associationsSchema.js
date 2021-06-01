import Joi from "joi";

const associationsSchema = Joi.object().keys({
  id: Joi.string().allow("").required(),
  title: Joi.string().allow("").required(),
  desc: Joi.string().allow(""),
  mode: Joi.string().allow("").required(),
  colour: Joi.string().allow(""),
  type: Joi.string().allow(""),
  display: Joi.string().allow(""),
  filter_paths: Joi.array(),
});

export default associationsSchema;
