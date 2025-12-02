// middlewares/i18n.js

/**
 * @typedef {'es' | 'en'} SupportedLangs
 */

/**
 * @type {Record<SupportedLangs, Record<string, string>>}
 */
const translations = {
  es: {
    'rateLimit.login': 'Demasiados intentos de inicio de sesión desde esta IP, inténtelo de nuevo después de 15 minutos',
    'rateLimit.default': 'Demasiadas solicitudes desde esta IP, inténtelo de nuevo más tarde',
    'auth.tokenRequired': 'Token de autenticación requerido',
    'auth.tokenInvalid': 'Token inválido',
    'auth.notAuthenticated': 'Usuario no autenticado',
    'auth.insufficientPermissions': 'Permisos insuficientes',
    'validation.missingFields': 'Campos requeridos faltantes',
    'auth.invalidCredentials': 'Credenciales inválidas',
    'user.created': 'Usuario creado exitosamente',
    'product.created': 'Producto creado exitosamente',
    'error.invalidJson': 'JSON inválido en el body de la petición',
    'error.internal': 'Error interno del servidor',
    'error.notFound': 'Ruta no encontrada',
  },
  en: {
    'rateLimit.login': 'Too many login attempts from this IP, please try again after 15 minutes',
    'rateLimit.default': 'Too many requests from this IP, please try again later',
    'auth.tokenRequired': 'Authentication token required',
    'auth.tokenInvalid': 'Invalid token',
    'auth.notAuthenticated': 'User not authenticated',
    'auth.insufficientPermissions': 'Insufficient permissions',
    'validation.missingFields': 'Required fields are missing',
    'auth.invalidCredentials': 'Invalid credentials',
    'user.created': 'User created successfully',
    'product.created': 'Product created successfully',
    'error.invalidJson': 'Invalid JSON in request body',
    'error.internal': 'Internal server error',
    'error.notFound': 'Route not found',
  }
};

/**
 * Middleware de internacionalización (i18n).
 * Determina el idioma de la solicitud y adjunta una función de traducción `t` al objeto `req`.
 * @param {import('express').Request} req - El objeto de solicitud de Express.
 * @param {import('express').Response} res - El objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - La función para pasar al siguiente middleware.
 */
function i18nMiddleware(req, res, next) {
  const langHeader = req.headers['accept-language'];
  /** @type {SupportedLangs} */
  let lang = 'es'; // Idioma por defecto

  if (langHeader) {
    const preferredLang = langHeader.split(',')[0].split('-')[0];
    if (translations[preferredLang]) {
      lang = /** @type {SupportedLangs} */ (preferredLang);
    }
  }

  /**
   * Función de traducción.
   * @param {string} key - La clave del mensaje a traducir.
   * @returns {string} El mensaje traducido.
   */
  req.t = (key) => {
    return translations[lang][key] || key;
  };

  next();
}

module.exports = i18nMiddleware;
