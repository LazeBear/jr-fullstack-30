const config = require('../utils/config');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something unexpected happened';

  if (status >= 500) {
    logger.error(message, { req, err });
  } else {
    // request id
    // user id
    logger.info(message, { req, err });
  }

  res.status(status).json({
    success: false,
    error: {
      message,
      // ...config.NODE_ENV === 'dev' && {stack: err.stack}
    },
  });
};

module.exports = errorHandler;

// stack trace
