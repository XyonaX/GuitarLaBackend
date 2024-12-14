import { Router } from "express";
import { registerHandler, loginHandler} from "../handlers/authHandler.js";
import passport from '../middleware/googleAuth.js';

const authRouter = Router();

authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);
authRouter.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

authRouter.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Si la autenticación fue exitosa, envía el token en formato JSON
        if (req.user && req.user.token) {
            // Devuelve el token al frontend en la respuesta JSON
            res.json({ token: req.user.token });  
        } else {
            res.status(400).json({ message: 'Error al autenticar al usuario.' });
        }
    }
);

export default authRouter;