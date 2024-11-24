import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
const ACCESS_TOKEN_EXPIRE_MINUTES = parseInt(process.env.ACCESS_TOKEN_EXPIRE_MINUTES!); // Durée d'expiration du jeton
const ALGORITHM = process.env.ALGORITHM;

/**
 * Crée un access token
 * @param data - Les données à inclure dans le JWT
 * @returns Le token JWT encodé
 */
export const createAccessToken = (id_user: number): string => {
    if (!SECRET_KEY || !ALGORITHM || isNaN(ACCESS_TOKEN_EXPIRE_MINUTES)) {
        throw new Error('Les variables nécessaires (SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES) ne sont pas correctement définies');
    }
    const now = Math.floor(Date.now() / 1000); // Timestamp actuel en secondes
    const expire = now + ACCESS_TOKEN_EXPIRE_MINUTES! * 60; // Expiration en secondes

    // Payload du JWT
    const payload = {
        sub: id_user,
        exp: expire, // Date d'expiration
        iat: now, // Date de création
    };

    // Génération du token
    return jwt.sign(payload, SECRET_KEY, { algorithm: ALGORITHM as jwt.Algorithm });
};



export const hashPassword = (password: string): string => {
    return bcrypt.hashSync(password, SECRET_KEY); // Hachage du mot de passe avec un salt de 12 tours
};

export const verifyPassword = (password: string, hashedPassword: string): boolean => {
    return bcrypt.compareSync(password, hashedPassword);
};


