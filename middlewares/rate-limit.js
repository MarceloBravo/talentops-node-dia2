const rateLimit = require('express-rate-limit');

/**
 * Crea un middleware de limitación de velocidad (rate limiting) para Express.
 * @param {number} windowMs - La ventana de tiempo en milisegundos para la cual se cuentan las solicitudes.
 * @param {number} max - El número máximo de solicitudes permitidas por IP durante la ventana de tiempo.
 * @param {string | ((req: import('express').Request, res: import('express').Response) => string)} [message] - El mensaje o función para generar el mensaje a enviar cuando se excede el límite.
 * @returns {Function} El middleware de express-rate-limit configurado.
 */
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: message || 'Demasiadas solicitudes desde esta IP, inténtelo de nuevo más tarde'
  });
};

module.exports = createRateLimiter;
