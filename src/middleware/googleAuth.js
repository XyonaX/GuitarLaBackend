import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../schema/Users.js';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback',
            scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Verificar si el usuario ya existe en la base de datos
                let user = await User.findOne({ email: profile.emails[0].value });

                if (!user) {
                    // Si no existe, crea un nuevo usuario con los datos de Google
                    user = new User({
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        authProvider: "google", 
                        fullName: profile.displayName,
                        dateOfBirth: null,
                        phone: null,
                        address: null,
                    });
                    await user.save();
                }

                const token = jwt.sign(
                    { id: user.id, role: user.role }, // Payload
                    process.env.JWT_SECRET || 'my_secret_key', // Clave secreta (debería estar en .env)
                    { expiresIn: '1h' } // Expiración del token
                );

                // Pasamos la información del token y el usuario al siguiente middleware
                done(null, { token, user });

            } catch (error) {
                done(error, null);
            }
        }
    )
);

// Serializar y deserializar usuario para las sesiones
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;