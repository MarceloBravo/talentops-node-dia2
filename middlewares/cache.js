const cache = new Map();

/**
 * Middleware de caché en memoria para respuestas GET.
 * Almacena la respuesta de una solicitud GET exitosa y la sirve
 * directamente en solicitudes posteriores a la misma URL.
 * @param {import('express').Request} req - El objeto de solicitud de Express.
 * @param {import('express').Response} res - El objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - La función para pasar al siguiente middleware.
 */
function cacheMiddleware(req, res, next) {
  if (req.method !== 'GET') {
    return next();
  }

  const key = req.originalUrl;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    console.log(`Sirviendo desde caché: ${key}`);
    return res.send(cachedResponse);
  }

  console.log(`No hay caché para: ${key}. Realizando solicitud...`);
  const originalSend = res.send;
  res.send = (body) => {
    cache.set(key, body);
    originalSend.call(res, body);
  };

  next();
}

/**
 * Limpia la caché para una clave específica.
 * @param {string} key - La clave de caché a limpiar.
 */
function clearCache(key) {
    if (cache.has(key)) {
        cache.delete(key);
        console.log(`Caché limpiada para: ${key}`);
    }
}

module.exports = { cacheMiddleware, clearCache };
