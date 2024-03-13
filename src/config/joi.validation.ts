// import * as Joi from "joi";
const Joi=require('joi')
const JoiTimezone=require('joi-tz')
const JoiTZ = Joi.extend(JoiTimezone);
export const JoiValidationSchema = Joi.object({
    NODE_ENV: Joi.string().required().valid('development', 'production'),
    PORT: Joi.number().integer().min(1).max(65535).default(3000),
    DATABASE_URL: Joi.string(),
    TIMEZONE:JoiTZ.timezone().required()//the answer
})