import pool from "../config/db";
import {User} from "../types/userTypes";
import {hashPassword} from "../utils/authUtils";

async function getUserDataById(userId: number): Promise<User> {
    const query = 'SELECT * FROM users WHERE user_id = $1';
    const values = [userId];
    try {
        const result = await pool.query(query, values);
        return result.rows[0]; // Assuming user_id is unique and returns a single user
    } catch (error) {
        throw error;
    }
}

async function registerUser(username: string, email: string, password: string): Promise<any> {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const hashedPassword = await hashPassword(password);
        const insertUserText = 'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *';
        const insertUserValues = [username, email, hashedPassword];
        const userResult = await client.query(insertUserText, insertUserValues);
        const newUser = userResult.rows[0];

        const insertUserRoleText = 'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)';
        const insertUserRoleValues = [newUser.user_id, 2]; // Assuming role_id 2 is to be assigned
        await client.query(insertUserRoleText, insertUserRoleValues);

        await client.query('COMMIT');
        return newUser;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function deleteUser(userId: number): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const deleteUserRoleText = 'DELETE FROM user_roles WHERE user_id = $1';
        await client.query(deleteUserRoleText, [userId]);

        const deleteUserText = 'DELETE FROM users WHERE user_id = $1 RETURNING *';
        const deleteUserResult = await client.query(deleteUserText, [userId]);
        if (deleteUserResult.rows.length === 0) {
            throw new Error('User not found.');
        }

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error; // Rethrow the error to be handled by the caller
    } finally {
        client.release();
    }
}

async function updateUser(userId: number, username: string, email: string, password: string): Promise<User> {
    try {
        const hashedPassword = await hashPassword(password);
        const result = await pool.query(
            'UPDATE users SET username = $1, email = $2, password_hash = $3 WHERE user_id = $4 RETURNING *',
            [username, email, hashedPassword, userId]
        );
        if (result.rows.length === 0) {
            throw new Error('User not found.');
        }
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

export {
    getUserDataById,
    registerUser,
    deleteUser,
    updateUser
};