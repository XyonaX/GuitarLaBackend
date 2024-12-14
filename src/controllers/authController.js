import bcrypt from 'bcryptjs';
import User from '../schema/Users.js';
import jwt from 'jsonwebtoken';

// Registrar un nuevo usuario
const registerController = async (username, email, password, fullName, dateOfBirth, phone, address, role = 'user', status = "activo") => {
    // Verifica si el usuario ya existe por email o username
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
        const field = userExists.email === email ? 'correo' : 'nombre de usuario';
        throw new Error(`El ${field} ya está registrado.`); // Lanzamos un error claro
    }

    // Hashea la contraseña
    const hashPassword = await bcrypt.hash(password, 10);

    // Crea el nuevo usuario con los datos
    const newUser = new User({
        username,
        email,
        password: hashPassword,
        fullName,
        dateOfBirth,
        phone,
        address,
        role,
        status,
    });

    // Guarda al usuario en la base de datos
    const savedUser = await newUser.save();

    // Excluye la contraseña antes de devolver el usuario creado
    const { password: _, ...userWithoutPassword } = savedUser.toObject();

    return userWithoutPassword; // Devuelve el usuario sin la contraseña
}

// Iniciar sesión
const loginController = async (email, password) => {
    // Busca al usuario en la base de datos por email
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("El usuario no está registrado.");
    }

    // Compara la contraseña con la almacenada en la base de datos
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error("Contraseña incorrecta.");
    }

    // Generar el token JWT
    const token = jwt.sign(
        { id: user.id, role: user.role }, // Payload
        process.env.JWT_SECRET || 'my_secret_key', // Clave secreta (debería estar en .env)
        { expiresIn: '1h' } // Expiración del token
    );
    console.log(token);


    // Excluye la contraseña antes de devolver los datos del usuario
    const { password: _, ...userWithoutPassword } = user.toObject();

    return {
        message: "Inicio de sesión exitoso.",
        token,
        user: userWithoutPassword,
    };
}

export {
    registerController,
    loginController
}
