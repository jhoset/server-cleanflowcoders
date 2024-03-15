const Joi = require('joi');
const JoiTimezone = require('joi-tz');
const JoiTZ = Joi.extend(JoiTimezone);
export const JoiValidationSchema = Joi.object({
  NODE_ENV: Joi.string().required().valid('development', 'production'),
  PORT: Joi.number().integer().min(1).max(65535).default(3000),
  DATABASE_URL: Joi.string(),
  CLIENT_URL: Joi.string().default('http://localhost:4000/'),
  SERVER_URL: Joi.string().default('http://localhost:3000/'),
  TIMEZONE: JoiTZ.timezone().required(),
  BOT_TOKEN_DISCORD: Joi.string().required(),
  SERVER_ID_DISCORD: Joi.string().required(),
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
});
