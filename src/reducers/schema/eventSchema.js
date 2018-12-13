import Joi from 'joi';

const eventSchema = Joi.object().keys({
    id:               Joi.string().required(),
    description:      Joi.string().allow('').required(),
    date:             Joi.string().required(),
    time:             Joi.string().required(),
    time_precision:   Joi.string().allow(''),
    location:         Joi.string().allow('').required(),
    latitude:         Joi.string().allow('').required(),
    longitude:        Joi.string().allow('').required(),
    type:             Joi.string().allow(''),
    category:         Joi.string().required(),
    narrative:        Joi.string().allow(''),
    sources:          Joi.array(),
    tags:             Joi.string().allow(''),
    comments:         Joi.string().allow(''),
    timestamp:        Joi.string().required(),
});

export default eventSchema;
