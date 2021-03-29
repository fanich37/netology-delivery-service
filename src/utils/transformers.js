const transformErrors = (errors) => {
  const { details } = errors;

  return details.reduce((acc, { message, context: { key } }) => ({
    ...acc, [key]: message,
  }), {});
};
exports.transformErrors = transformErrors;
