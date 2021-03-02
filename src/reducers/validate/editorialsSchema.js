import Joi from "joi";

const editorialsSchema = Joi.object().keys({
  id: Joi.string().allow("").required(),
  description: Joi.string().allow(""),
  chapters: Joi.array(),
  event_list: Joi.string().allow(""),
});

export default editorialsSchema;
