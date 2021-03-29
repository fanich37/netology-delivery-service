const { transformErrors } = require('./transformers');

const createEmptyValuesValidatorMiddleware = (schema) => (
  req,
  res,
  next,
) => {
  const { error } = schema.validate(req.body, { allowUnknown: true, abortEarly: false });

  if (error) {
    return res.status(422).json(transformErrors(error));
  }

  next();
};
exports.createEmptyValuesValidatorMiddleware = createEmptyValuesValidatorMiddleware;
