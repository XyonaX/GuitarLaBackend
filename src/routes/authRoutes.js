import { Router } from "express";
import { registerHandler, loginHandler} from "../handlers/authHandler.js";
import passport from '../middleware/googleAuth.js';

const authRouter = Router();

authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);
authRouter.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false})
);
authRouter.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        const { token } = req.user;

        if (token) {
            // Redirigir al frontend con el token en la URL
            res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${encodeURIComponent(token)}`);
        } else {
            res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
        }
    }
);




export default authRouter;