import mongoose from "mongoose";
import { getAllUsersController, getUserByNameController, getUserByIdController, createUserController, updateUserController, deleteUserController } from "../controllers/usersController.js";
import User from "../schema/Users.js";
import Joi from 'joi';

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
  status: Joi.string().valid('activo', 'inactivo').default('activo').allow(null, '').messages({
    'any.only': 'El estado debe ser "activo" o "inactivo".',
  })
});

const getAllUsersHandler = async (req, res) => {
  try {
    const {name} = req.query;
    if(name){
      const response = await getUserByNameController(name);
      res.status(200).json({
        success: true,
        data: response
      });
      
    } else {
      const response = await getAllUsersController();
      res.status(200).json({
        success: true,
        data: response
      });
      
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
    
  }
}

const getOneUserHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await getUserByIdController(id);
    res.status(200).send(response);
  } catch (error) {
    res.status(200).send({Error: error.message});
  }
}

const createUserHandler = async (req, res) => {
  try {
    // Limpia los campos opcionales
    const cleanedBody = Object.fromEntries(
      Object.entries(req.body).map(([key, value]) => [key, value || null])
    );

    // Validar datos con Joi
    const { error, value } = userSchema.validate(cleanedBody, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Error en los datos enviados.',
        details: error.details.map((detail) => detail.message),
      });
    }

    // Crear usuario
    const { username, email, password, fullName, dateOfBirth, phone, address, role, status } = value;
    const response = await createUserController(username, email, password, fullName, dateOfBirth, phone, address, role, status);

    res.status(201).send(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const updateUserHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, fullName, dateOfBirth, phone, address, status, role } = req.body; 
    const userId = req.userId;
    const userRole = req.userRole;
    // Realiza la actualización del usuario
    const response = await updateUserController(id, username, email, fullName, dateOfBirth, phone, address, status, role);
    res.send(response);
  } catch (error) {
    res.status(400).send({ Error: error.message });
  }
};

const deleteUserHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id); // Busca y elimina el usuario
    if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado." });
    }

    res.status(200).json({ message: "Usuario eliminado correctamente." });
  } catch (error) {
      console.error("Error eliminando usuario:", error);
      res.status(500).json({ error: "Error eliminando usuario." });
  }
}

export {
  getAllUsersHandler,
  getOneUserHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler
}