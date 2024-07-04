import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface JWTPayload {
    userId: number;
    email: string;
    username: string;
}

const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

const generateToken = (user: { userId: number; email: string; username: string }): string => {
    const secret = process.env.JWT_SECRET || '';
    if (!secret) {
        console.log('JWT env not provided');
    }
    return jwt.sign(user, secret, {expiresIn: '7d'});
};

function authenticateJWT(token: string): JWTPayload {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        throw new Error('No secret key');
    }
    const decoded = jwt.verify(token, secretKey);
    return decoded as JWTPayload;
}

export {hashPassword, generateToken, authenticateJWT};