import { Request, Response } from 'express';
import UserController from './userController';
import pool from "../config/db";
import bcrypt from 'bcryptjs';
import {describe} from "node:test";
import jwt from "jsonwebtoken";

// Mocking external dependencies
jest.mock('bcryptjs');
jest.mock('../config/db');
jest.mock('jsonwebtoken', () => ({
    ...jest.requireActual('jsonwebtoken'), // This line ensures other methods of jsonwebtoken are still usable
    sign: jest.fn().mockReturnValue('mockToken'), // Explicitly mock `sign` method
}));

describe('UserController without DB', () => {
    describe('register', () => {
        it('registers a user successfully without hitting the DB', async () => {
            // Mock request and response
            const req = {
                body: {
                    username: 'testUser',
                    email: 'test@example.com',
                    password: 'password123',
                },
            } as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            } as unknown as Response;

            // Mocking bcrypt hash function
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

            // Mocking the database call
            (pool.query as jest.Mock).mockResolvedValue({
                rows: [{user_id: 1, username: 'testUser', email: 'test@example.com', created_at: new Date()}],
            });

            // Calling the register method
            await UserController.register(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.anything());
        });
    })
    describe('login', () => {
        it('should authenticate user and return JWT without hitting the DB', async () => {
            // Mock request and response
            const req = {
                body: {
                    email: 'test@example.com',
                    password: 'password123',
                },
            } as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            } as unknown as Response;

            // Mocking bcrypt.compare to simulate a password match
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            // Mocking the database call to simulate finding the user
            (pool.query as jest.Mock).mockResolvedValue({
                rows: [{
                    user_id: 1,
                    email: 'test@example.com',
                    password_hash: 'hashedPassword',
                }],
            });

            // Mocking jwt.sign to return a token
            (jwt.sign as jest.Mock).mockReturnValue('mockToken');

            // Calling the login method
            await UserController.login(req, res);

            // Assertions
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Login successful!',
                token: 'mockToken',
            }));
        });
    });

    describe('get', () => {
        it('should retrieve user details successfully', async () => {
            const req = { user: { userId: 1 } } as Request;
            const res = {
                json: jest.fn().mockReturnThis(),
                status: jest.fn().mockReturnThis(),
            } as unknown as Response;

            (pool.query as jest.Mock).mockResolvedValue({
                rows: [{ user_id: 1, username: 'testUser', email: 'test@example.com', created_at: new Date() }],
            });

            await UserController.get(req, res);

            console.log(res.status);
            console.log(res.json);

            expect(res.json).toHaveBeenCalledWith(expect.anything());
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('update', () => {
        it('should update user details successfully', async () => {
            const req = {
                user: { userId: 1 },
                body: {
                    username: 'updatedUser',
                    email: 'updated@example.com',
                    password: 'newPassword123',
                },
            } as Request;
            const res = {
                json: jest.fn().mockReturnThis(),
                status: jest.fn().mockReturnThis(),
            } as unknown as Response;

            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedNewPassword');
            (pool.query as jest.Mock).mockResolvedValue({
                rows: [{ user_id: 1, username: 'updatedUser', email: 'updated@example.com', updated_at: new Date() }],
            });

            await UserController.update(req, res);

            expect(res.json).toHaveBeenCalledWith(expect.anything());
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('delete', () => {
        it('should delete a user successfully', async () => {
            const req = { user: { userId: 1 } } as Request;
            const res = {
                json: jest.fn().mockReturnThis(),
                status: jest.fn().mockReturnThis(),
            } as unknown as Response;

            (pool.query as jest.Mock).mockResolvedValue({
                rows: [{ user_id: 1 }],
            });

            await UserController.delete(req, res);

            expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully.' });
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});