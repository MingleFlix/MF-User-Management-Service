import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

const generateToken = (user: { userId: number; email: string; username: string }): string => {
    const secret = process.env.JWT_SECRET || '';
    if (!secret) {
        console.log('JWT env not provided');
    }
    return jwt.sign(user, secret, { expiresIn: '7d' });
};

export { hashPassword, generateToken };