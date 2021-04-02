const { EmptyValueErrorSymbol } = require('./constants');

const createEmptyValuesValidatorMiddleware = (schema) => (
  req,
  res,
  next,
) => {
  const { error } = schema.validate(req.body, { allowUnknown: true, abortEarly: false });

  if (error) {
    req[EmptyValueErrorSymbol] = error;
  }

  next();
};
exports.createEmptyValuesValidatorMiddleware = createEmptyValuesValidatorMiddleware;
