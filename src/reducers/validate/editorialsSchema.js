import Joi from "joi";

const editorialsSchema = Joi.object().keys({
  id: Joi.string().allow("").required(),
  title: Joi.string().allow(""),
  chapters: Joi.array(),
  chapter_events: Joi.array(),
  chapter_associations: Joi.array(),
});

export default editorialsSchema;
