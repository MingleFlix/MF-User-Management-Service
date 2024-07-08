import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/*
 * Author: Jesse Günzl
 * Matrikelnummer: 2577166
 */

// Interface defining the structure of the payload in the JWT token
export interface JWTPayload {
    userId: number;
    email: string;
    username: string;
}

// Function to hash a password using bcrypt
const hashPassword = async (password: string): Promise<string> => {
    // Hash password with a salt round of 10 and return the hashed password
    return await bcrypt.hash(password, 10);
};

// Function to generate a JWT token for a user
const generateToken = (user: { userId: number; email: string; username: string }): string => {
    // Retrieve the JWT secret from environment variables
    const secret = process.env.JWT_SECRET || '';
    if (!secret) {
        console.log('JWT env not provided');
    }
    // Sign the JWT with the user's details and set an expiry of 7 days
    return jwt.sign(user, secret, {expiresIn: '7d'});
};

// Function to authenticate a JWT token and return the payload
function authenticateJWT(token: string): JWTPayload {
    // Retrieve the JWT secret key from environment variables
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        throw new Error('No secret key');
    }
    // Verify the token with the secret key and return the decoded payload
    const decoded = jwt.verify(token, secretKey);
    return decoded as JWTPayload;
}

export {hashPassword, generateToken, authenticateJWT};