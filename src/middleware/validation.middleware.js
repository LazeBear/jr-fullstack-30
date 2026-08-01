const ValidationException = require('../exceptions/validation.exception');
const { z } = require('zod');

const validateBody = (schema) => async (req, res, next) => {
  const result = await schema.safeParseAsync(req.body);
  if (!result.success) {
    const message = result.error.issues.map((i) => i.message).join(', ');
    // const message = z.treeifyError(result.error);
    throw new ValidationException(message);
  }
  req.body = result.data;
  next();
};

module.exports = { validateBody };
