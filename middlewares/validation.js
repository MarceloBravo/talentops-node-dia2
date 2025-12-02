/**
 * @fileoverview Módulo de validación con esquemas Joi
 * Proporciona middlewares y esquemas para validar datos de entrada
 */

const Joi = require('joi');

/**
 * Esquema Joi para validar la creación de un usuario
 * @type {Joi.ObjectSchema}
 */
const usuarioSchema = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.empty': 'El nombre no puede estar vacío',
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no puede exceder 50 caracteres',
      'any.required': 'El nombre es obligatorio'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'El email debe ser válido',
      'any.required': 'El email es obligatorio'
    }),
  activo: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'El campo activo debe ser verdadero o falso'
    })
});

/**
 * Esquema Joi para validar la actualización de un usuario
 * Todos los campos son opcionales pero debe haber al menos uno
 * @type {Joi.ObjectSchema}
 */
const usuarioUpdateSchema = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(50)
    .messages({
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no puede exceder 50 caracteres'
    }),
  email: Joi.string()
    .email()
    .messages({
      'string.email': 'El email debe ser válido'
    }),
  activo: Joi.boolean()
    .messages({
      'boolean.base': 'El campo activo debe ser verdadero o falso'
    })
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
});

/**
 * Middleware genérico de validación con esquemas Joi
 * Valida req.body contra un esquema y retorna errores detallados
 * 
 * @param {Joi.Schema} schema - Esquema Joi para validar
 * @returns {Function} Middleware Express
 * 
 * @example
 * app.post('/usuarios', validate(usuarioSchema), (req, res) => {...})
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      // Mapear errores de validación a formato legible
      const messages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Errores de validación',
        details: messages,
        timestamp: new Date().toISOString()
      });
    }

    // Reemplazar req.body con los datos validados y sanitizados
    req.body = value;
    next();
  };
};

/**
 * Middleware para validar parámetros de ruta (ID)
 * Verifica que el ID sea un número entero positivo
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Función next de Express
 * 
 * @example
 * app.get('/usuarios/:id', validateId, (req, res) => {...})
 */
const validateId = (req, res, next) => {
  const { id } = req.params;

  const schema = Joi.object({
    id: Joi.number().integer().positive().required()
  });

  const { error } = schema.validate({ id: Number(id) });

  if (error) {
    return res.status(400).json({
      success: false,
      error: 'ID inválido',
      message: 'El ID debe ser un número positivo',
      timestamp: new Date().toISOString()
    });
  }

  next();
};

/**
 * Exporta los módulos de validación
 * @exports validation
 * 
 * @property {Function} validate - Middleware genérico de validación
 * @property {Function} validateId - Middleware para validar IDs en rutas
 * @property {Joi.ObjectSchema} usuarioSchema - Esquema para crear usuarios
 * @property {Joi.ObjectSchema} usuarioUpdateSchema - Esquema para actualizar usuarios
 */
module.exports = {
  validate,
  validateId,
  usuarioSchema,
  usuarioUpdateSchema
};
