const Joi = require('joi');
const bodyParser = require('body-parser');
const { createEmptyValuesValidatorMiddleware } = require('../utils/validators');

const urlEncodedParser = bodyParser.urlencoded({ extended: false });
exports.urlEncodedParser = urlEncodedParser;

const emptyValueValidator = createEmptyValuesValidatorMiddleware(Joi.object({
  password: Joi.string().required(),
  email: Joi.string().required(),
}));
exports.emptyValueValidator = emptyValueValidator;

const restrictedRouteMiddleware = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.redirect('/auth/login');
  }

  next();
};
exports.restrictedRouteMiddleware = restrictedRouteMiddleware;
