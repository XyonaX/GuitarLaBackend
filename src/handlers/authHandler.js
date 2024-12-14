import Joi from 'joi';
import { loginController, registerController } from '../controllers/authController.js';

const userSchema = Joi.object({
    username: Joi.string().min(3).max(15).required().messages({
        'string.empty': 'El nombre de usuario es obligatorio.',
        'string.min': 'El nombre de usuario debe tener al menos 3 caracteres.',
        'string.max': 'El nombre de usuario no puede tener más de 15 caracteres.',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Debes proporcionar un correo electrónico válido.',
        'string.empty': 'El correo electrónico es obligatorio.',
    }),
    //La contraseña tenga un mínimo de 6 caracteres, al menos 1 letra mayúscula, 1 letra minúscula y 1 número sin espacios
    password: Joi.string()
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{6,}$/)
    .required()
    .messages({
        'string.pattern.base': 'La contraseña debe tener al menos 6 caracteres, incluir una letra mayúscula, una letra minúscula y un número, y no debe contener espacios.',
        'string.empty': 'La contraseña es obligatoria.',
    }),
    fullName: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'El nombre completo es obligatorio.',
        'string.min': 'El nombre completo debe tener al menos 3 caracteres.',
        'string.max': 'El nombre completo no puede exceder los 50 caracteres.',
    }),
    dateOfBirth: Joi.string().optional().allow(null).messages({
        'date.base': 'La fecha de nacimiento debe ser una fecha válida.',
    }),
    phone: Joi.string()
        .pattern(/^[0-9]{10,15}$/)
        .optional()
        .allow(null)
        .messages({
        'string.pattern.base': 'El teléfono debe contener entre 10 y 15 dígitos.',
        }),
    address: Joi.string().optional().allow(null).max(100).messages({
        'string.max': 'La dirección no puede exceder los 100 caracteres.',
    }),
    role: Joi.string().valid('admin', 'user').default('user').messages({
        'any.only': 'El rol debe ser "admin" o "user".',
    }),
    status: Joi.string().valid('activo', 'inactivo').default('activo').messages({
        'any.only': 'El estado debe ser "activo" o "inactivo".',
    }),
});

const registerHandler = async (req, res) => {
    try {
        const { error, value } = userSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({
                message: 'Error en los datos enviados.',
                details: error.details.map((detail) => detail.message),
            });
        }

        const response = await registerController(
            value.username, 
            value.email, 
            value.password, 
            value.fullName, 
            value.dateOfBirth, 
            value.phone, 
            value.address, 
            value.role
        );

        res.status(201).json({ message: 'Usuario registrado con éxito.', user: response });

    } catch (error) {
        // Asegúrate de que el error contenga el mensaje adecuado
        if (error.message && error.message.includes("ya está registrado")) {
            return res.status(409).json({ message: error.message });
        }

        console.error("Error interno:", error);
        res.status(500).json({ message: 'Ocurrió un error inesperado. Intenta más tarde.' });
    }

}

const loginHandler= async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verifica credenciales usando el controlador
        const response = await loginController(email, password);
        
        // Envía la respuesta incluyendo el userID
        res.status(200).json(response);
    } catch (error){
        if (error.message === "El usuario no está registrado." || error.message === "Contraseña incorrecta.") {
            return res.status(400).json({ message: error.message });
        }
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
}

export {
    registerHandler,
    loginHandler,
}