const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: message || 'Demasiadas solicitudes desde esta IP, inténtelo de nuevo más tarde'
  });
};

module.exports = createRateLimiter;
