const transformErrors = (error) => {
  const { details } = error;

  return details.reduce((acc, { message, context: { key } }) => ({
    ...acc, [key]: message,
  }), {});
};
exports.transformErrors = transformErrors;
