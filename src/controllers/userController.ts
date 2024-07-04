import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from "../config/db";

class UserController {
    // Register a new user
    async register(req: Request, res: Response): Promise<void> {
        console.log('Registering new user', req.body)
        const { username, email, password } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await pool.query(
                'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
                [username, email, hashedPassword]
            );
            const newUser = result.rows[0];
            res.status(201).json({
                userId: newUser.user_id,
                username: newUser.username,
                email: newUser.email,
                created_at: newUser.created_at
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ message: 'Error registering new user.', error: error.message });
            } else {
                res.status(500).json({message: 'Error registering new user.'});
            }
        }
    }

    // Authenticate user and return JWT
    async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        try {
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (result.rows.length > 0) {
                const user = result.rows[0];
                const isMatch = await bcrypt.compare(password, user.password_hash);
                if (isMatch) {
                    const secret = process.env.JWT_SECRET || 'mysecretkey';
                    if (!secret) {
                        console.log('JWT secret not found');
                    }
                    const token = jwt.sign(
                        { userId: user.user_id, email: user.email, username: user.username},
                        secret,
                        { expiresIn: '7d' }
                    );
                    res.json({ message: 'Login successful!', token });
                } else {
                    res.status(400).json({ message: 'Invalid credentials.' });
                }
            } else {
                res.status(404).json({ message: 'User not found.' });
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ message: 'Error logging in.', error: error.message });
            } else {
                res.status(500).json({ message: 'Error logging in.' });
            }
        }
    }

    // Additional methods like updateProfile, deleteUser etc. can be added here.
}

export default new UserController();