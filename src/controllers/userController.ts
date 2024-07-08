import {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import {deleteUser, getUserDataByEmail, getUserDataById, registerUser, updateUser} from "../models/user";
import {generateToken} from "../utils/authUtils";
import {getRolesForUser} from "../models/roles";

/*
 * Author: Jesse Günzl
 * Matrikelnummer: 2577166
 */

class UserController {
    // Register a new user
    async register(req: Request, res: Response): Promise<void> {
        console.log('Registering new user', req.body);
        const {username, email, password} = req.body;
        try {
            // Call the model function to register the user
            await registerUser(username, email, password);
            res.status(201).json({
                message: 'User registered successfully',
            });
        } catch (error: unknown) {
            // Handle any errors during registration
            if (error instanceof Error) {
                res.status(500).json({message: 'Error registering new user.', error: error.message});
            } else {
                res.status(500).json({message: 'Error registering new user.'});
            }
        }
    }

    // Authenticate user and return JWT
    async login(req: Request, res: Response): Promise<void> {
        const {email, password} = req.body;
        try {
            // Retrieve user data by email
            const user = await getUserDataByEmail(email);
            // Compare provided password with stored password hash
            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (isMatch) {
                // Generate JWT token if passwords match
                const token = generateToken({userId: user.user_id, email: user.email, username: user.username});
                res.json({message: 'Login successful!', token});
            } else {
                res.status(400).json({message: 'Invalid credentials.'});
            }
        } catch (error: unknown) {
            // Handle any errors during login
            if (error instanceof Error) {
                res.status(500).json({message: 'Error logging in.', error: error.message});
            } else {
                res.status(500).json({message: 'Error logging in.'});
            }
        }
    }

    // Delete user
    async delete(req: Request, res: Response): Promise<void> {
        console.log('Deleting user');
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({message: 'User ID is required.'});
            return;
        }
        try {
            // Call the model function to delete the user
            await deleteUser(userId);
            res.status(200).json({message: 'User deleted successfully.'});
        } catch (error) {
            // Handle any errors during deletion
            if (error instanceof Error) {
                res.status(500).json({message: 'Error deleting user.', error: error.message});
            } else {
                res.status(500).json({message: 'Error deleting user.'});
            }
        }
    }

    // Update user
    async update(req: Request, res: Response): Promise<void> {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({message: 'User ID is required.'});
            return;
        }
        const {username, email, password} = req.body;
        try {
            // Hash the new password
            const hashedPassword = await bcrypt.hash(password, 10);
            // Call the model function to update the user
            const updatedUser = await updateUser(userId, username, email, hashedPassword);
            res.status(200).json({
                userId: updatedUser.user_id,
                username: updatedUser.username,
                email: updatedUser.email,
                updated_at: updatedUser.updated_at
            });
            return;
        } catch (error: unknown) {
            // Handle any errors during update
            if (error instanceof Error) {
                res.status(500).json({message: 'Error updating user.', error: error.message});
            } else {
                res.status(500).json({message: 'Error updating user.'});
            }
        }
    }

    // Get own user details
    async get(req: Request, res: Response): Promise<void> {
        const userId = req.user?.userId;
        try {
            if (!userId) {
                res.status(401).json({message: 'Access denied.'});
                return;
            }
            // Retrieve user data by ID
            const user = await getUserDataById(userId);
            if (user) {
                console.log('User found:', user);
                res.status(200).json({
                    userId: user.user_id,
                    username: user.username,
                    email: user.email,
                    createdAt: user.created_at
                });
                return;
            } else {
                res.status(404).json({message: 'User not found.'});
                return;
            }
        } catch (error: unknown) {
            // Handle any errors during retrieval
            if (error instanceof Error) {
                res.status(500).json({message: 'Error getting user.', error: error.message});
                return;
            } else {
                res.status(500).json({message: 'Error getting user.'});
                return;
            }
        }
    }

    // Get user details by ID
    async getById(req: Request, res: Response): Promise<void> {
        const userId = parseInt(req.params.id);

        if (!userId) {
            res.status(400).json({message: 'User ID is required.'});
            return;
        }

        const requestorId = req.user?.userId;
        // Check if the requestor has the necessary roles or is the user themselves
        const roles = await getRolesForUser(requestorId);
        if (!roles.includes('admin') && requestorId !== userId) {
            res.status(401).json({message: 'Access denied.'});
            return;
        }

        try {
            // Retrieve user data by ID
            const user = await getUserDataById(userId);
            if (user) {
                console.log('User found:', user);
                res.status(200).json({
                    userId: user.user_id,
                    username: user.username,
                    email: user.email,
                    createdAt: user.created_at,
                    updatedAt: user.updated_at,
                    roles,
                });
                return;
            } else {
                res.status(404).json({message: 'User not found.'});
                return;
            }
        } catch (error: unknown) {
            // Handle any errors during retrieval
            if (error instanceof Error) {
                res.status(500).json({message: 'Error getting user.', error: error.message});
                return;
            } else {
                res.status(500).json({message: 'Error getting user.'});
                return;
            }
        }
    }
}

export default new UserController();
