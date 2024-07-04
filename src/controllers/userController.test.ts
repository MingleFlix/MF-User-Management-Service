import {Request, Response} from 'express';
import UserController from './userController';
import bcrypt from 'bcryptjs';
import {describe} from "node:test";
import * as userModel from '../models/user';

// Mocking model functions
jest.mock('../models/user', () => ({
    registerUser: jest.fn(),
    getUserDataById: jest.fn(),
    getUserDataByEmail: jest.fn(),
    deleteUser: jest.fn(),
    updateUser: jest.fn(),
}));

// Mocking authUtils
jest.mock('../utils/authUtils', () => ({
    generateToken: jest.fn().mockReturnValue('mockToken'),
}));

// Mocking bcrypt
jest.mock('bcryptjs', () => ({
    compare: jest.fn(),
    hash: jest.fn(),
}));

describe('UserController', () => {
    let mockReq: Request;
    let mockRes: Response;

    beforeEach(() => {
        mockReq = {} as Request;
        mockRes = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
        } as unknown as Response;
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a user successfully', async () => {
            const mockUser = {user_id: 1, username: 'testUser', email: 'test@example.com', created_at: new Date()};
            (userModel.registerUser as jest.Mock).mockResolvedValue(mockUser);
            mockReq.body = {username: 'testUser', email: 'test@example.com', password: 'password123'};

            await UserController.register(mockReq, mockRes);

            expect(userModel.registerUser).toHaveBeenCalledWith('testUser', 'test@example.com', 'password123');
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(expect.anything());
        });
    });

    describe('login', () => {
        it('should authenticate user and return JWT', async () => {
            mockReq.body = {email: 'test@example.com', password: 'password123'};
            const mockUser = {user_id: 1, email: 'test@example.com', password_hash: 'hashedPassword'};
            (userModel.getUserDataByEmail as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            await UserController.login(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Login successful!',
                token: 'mockToken',
            }));
        });
    });

    describe('get', () => {
        it('should retrieve user details successfully', async () => {
            const mockUser = {user_id: 1, username: 'testUser', email: 'test@example.com', created_at: new Date()};
            mockReq.user = {username: 'testUser', email: 'test@example.com', userId: 1};
            (userModel.getUserDataById as jest.Mock).mockResolvedValue(mockUser);

            await UserController.get(mockReq, mockRes);

            expect(userModel.getUserDataById).toHaveBeenCalledWith(1);
            expect(mockRes.json).toHaveBeenCalledWith(expect.anything());
        });
    });

    describe('update', () => {
        it('should update user details successfully', async () => {
            const req = {
                user: {userId: 1},
                body: {
                    username: 'updatedUser',
                    email: 'updated@example.com',
                    password: 'newPassword123',
                },
            } as unknown as Request;
            const res = {
                json: jest.fn().mockReturnThis(),
                status: jest.fn().mockReturnThis(),
            } as unknown as Response;

            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedNewPassword');
            (userModel.updateUser as jest.Mock).mockResolvedValue({
                user_id: 1,
                username: 'updatedUser',
                email: 'updated@example.com',
                updated_at: new Date(),
            });

            await UserController.update(req, res);

            expect(userModel.updateUser).toHaveBeenCalledWith(1, 'updatedUser', 'updated@example.com', 'hashedNewPassword');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.anything());
        });
    });

    describe('delete', () => {
        it('should delete a user successfully', async () => {
            const req = {user: {userId: 1}} as unknown as Request;
            const res = {
                json: jest.fn().mockReturnThis(),
                status: jest.fn().mockReturnThis(),
            } as unknown as Response;

            (userModel.deleteUser as jest.Mock).mockResolvedValue({});

            await UserController.delete(req, res);

            expect(userModel.deleteUser).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({message: 'User deleted successfully.'});
        });
    });
});