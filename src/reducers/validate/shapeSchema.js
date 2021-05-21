import Joi from "joi";

const shapeSchema = Joi.object().keys({
  id: Joi.string().allow(""),
  title: Joi.string().allow(""),
  shape: Joi.string().allow(""),
  colour: Joi.string().allow(""),
});

export default shapeSchema;
