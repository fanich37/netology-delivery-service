const Joi = require('joi');
const bodyParser = require('body-parser');
const { createEmptyValuesValidatorMiddleware } = require('../utils/validators');

const urlEncodedParser = bodyParser.urlencoded({ extended: true });
exports.urlEncodedParser = urlEncodedParser;

const emptyValueValidator = createEmptyValuesValidatorMiddleware(Joi.object({
  name: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().required(),
}));
exports.emptyValueValidator = emptyValueValidator;
