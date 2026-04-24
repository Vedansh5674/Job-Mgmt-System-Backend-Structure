const { ZodError } = require('zod');
const logger = require('../utils/logger');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessage = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      logger.warn(`Validation Error: ${errorMessage}`);
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    next(error);
  }
};

module.exports = validate;
