import {NextFunction, Request, Response} from 'express';
import {authenticateJWT, JWTPayload} from "../utils/authUtils";

/*
 * Author: Jesse Günzl
 * Matrikelnummer: 2577166
 */

// Extending the Express Request interface to include a user property of type JWTPayload
declare global {
    namespace Express {
        interface Request {
            user: JWTPayload;
        }
    }
}

/**
 * Middleware to authenticate a user based on a JWT token stored in cookies.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function in the stack.
 */
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Retrieve the token from cookies
    const token = req.cookies['auth_token'];

    // If no token is found, return a 401 Unauthorized response
    if (!token) {
        return res.status(401).json({message: 'Access denied, no token provided'});
    }

    try {
        // Authenticate the token and attach the user payload to the request object
        req.user = authenticateJWT(token);

        // If the token is invalid, throw an error
        if (!req.user) {
            throw new Error('Invalid token');
        }

        // Call the next middleware function
        next();
    } catch (error) {
        // If an error occurs during token authentication, return a 401 Unauthorized response
        return res.status(401).json({message: 'Invalid token'});
    }
};

export default authMiddleware;
