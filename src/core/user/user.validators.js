const Joi = require('joi');

const UserValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  name: Joi.string().required(),
  contactPhone: Joi.string().allow(''),
});

exports.validateUserData = (userData) => UserValidationSchema
  .validate
  .call(UserValidationSchema, userData, { abortEarly: false });
