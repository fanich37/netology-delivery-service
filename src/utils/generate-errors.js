const generateErrors = (messages) => messages
  .reduce((acc, { message, key }) => {
    acc.error.details.push({ message, context: { key } });

    return acc;
  }, { error: { details: [] } });
exports.generateErrors = generateErrors;
