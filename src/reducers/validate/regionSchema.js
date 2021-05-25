import Joi from "joi";

const regionSchema = Joi.object().keys({
  name: Joi.string().required(),
  items: Joi.array().required(),
});

export default regionSchema;
