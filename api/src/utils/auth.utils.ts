import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

interface JwtPayload {
    sub: number;
    exp: number;
    iat: number;
}

interface JwtPayloadReset {
    email: string;
    exp: number;
    iat: number;
}

/**
 * Crée un access token
 * @param data - Les données à inclure dans le JWT
 * @returns Le token JWT encodé
 */
export const createAccessToken = (id_user: number): string => {
    // Vérification des variables d'environnement
    const SECRET_KEY = process.env.SECRET_KEY;
    const ALGORITHM = process.env.ALGORITHM;
    const ACCESS_TOKEN_EXPIRE_MINUTES = Number(process.env.ACCESS_TOKEN_EXPIRE_MINUTES);

    if (!SECRET_KEY || !ALGORITHM || isNaN(ACCESS_TOKEN_EXPIRE_MINUTES)) {
        throw new Error('Les variables nécessaires (SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES) ne sont pas correctement définies');
    }

    const now = Math.floor(Date.now() / 1000); // Timestamp actuel en secondes
    const expire = now + ACCESS_TOKEN_EXPIRE_MINUTES * 60; // Expiration en secondes

    // Payload du JWT
    const payload: JwtPayload = {
        sub: id_user,
        exp: expire, // Date d'expiration
        iat: now,    // Date de création
    };

    // Génération du token
    return jwt.sign(payload, SECRET_KEY, { algorithm: ALGORITHM as jwt.Algorithm });
};


/**
 * Crée un access token
 * @param email  - Les données à inclure dans le JWT
 * @returns Le token JWT encodé
 */
export const createResetPasswordToken = (email: string): string => {
    // Vérification des variables d'environnement
    const SECRET_KEY = process.env.SECRET_KEY;
    const ALGORITHM = process.env.ALGORITHM;
    const RESET_PASSWORD_TOKEN_EXPIRE_MINUTES = Number(process.env.RESET_PASSWORD_TOKEN_EXPIRE_MINUTES);

    if (!SECRET_KEY || !ALGORITHM || isNaN(RESET_PASSWORD_TOKEN_EXPIRE_MINUTES)) {
        throw new Error('Les variables nécessaires (SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES) ne sont pas correctement définies');
    }

    const now = Math.floor(Date.now() / 1000); // Timestamp actuel en secondes
    const expire = now + RESET_PASSWORD_TOKEN_EXPIRE_MINUTES * 60; // Expiration en secondes

    // Payload du JWT
    const payload: JwtPayloadReset = {
        email: email,
        exp: expire, // Date d'expiration
        iat: now,    // Date de création
    };

    // Génération du token
    return jwt.sign(payload, SECRET_KEY, { algorithm: ALGORITHM as jwt.Algorithm });
};



export const hashPassword = (password: string): string => {
    const salt = bcrypt.genSaltSync(12); // Génère un salt avec 12 tours
    return bcrypt.hashSync(password, salt); // Hachage du mot de passe avec le salt
};

export const verifyPassword = (password: string, hashedPassword: string): boolean => {
    return bcrypt.compareSync(password, hashedPassword); // Compare le mot de passe brut et le haché
};


