import pool from "../config/db";
import {User} from "../types/userTypes";
import {hashPassword} from "../utils/authUtils";

/*
 * Author: Jesse Günzl
 * Matrikelnummer: 2577166
 */

/**
 * Retrieves user data by their unique ID.
 *
 * @param userId The unique identifier of the user.
 * @returns A promise that resolves to the user's data.
 */
async function getUserDataById(userId: number): Promise<User> {
    const query = 'SELECT * FROM users WHERE user_id = $1'; // SQL query to select a user by ID
    const values = [userId]; // The ID of the user to find
    try {
        const result = await pool.query(query, values); // Execute the query with the user ID
        return result.rows[0]; // Return the first row of the result set
    } catch (error) {
        throw error; // Throw the error to be handled by the caller
    }
}

/**
 * Retrieves user data by their email address.
 *
 * @param email The email address of the user.
 * @returns A promise that resolves to the user's data.
 */
async function getUserDataByEmail(email: string): Promise<User> {
    const query = 'SELECT * FROM users WHERE email = $1'; // SQL query to select a user by email
    const values = [email]; // The email of the user to find
    try {
        const result = await pool.query(query, values); // Execute the query with the email
        return result.rows[0]; // Return the first row of the result set
    } catch (error) {
        throw error; // Throw the error to be handled by the caller
    }
}

/**
 * Registers a new user with a username, email, and password.
 *
 * @param username The username of the new user.
 * @param email The email address of the new user.
 * @param password The password for the new user.
 * @returns A promise that resolves to the newly created user's data.
 */
async function registerUser(username: string, email: string, password: string): Promise<any> {
    const client = await pool.connect(); // Connect to the database
    try {
        await client.query('BEGIN'); // Start a new transaction
        const hashedPassword = await hashPassword(password); // Hash the provided password
        const insertUserText = 'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *';
        const insertUserValues = [username, email, hashedPassword]; // Values to insert for the new user
        const userResult = await client.query(insertUserText, insertUserValues); // Insert the new user
        const newUser = userResult.rows[0]; // The newly inserted user

        const insertUserRoleText = 'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)';
        const insertUserRoleValues = [newUser.user_id, 2]; // Assign a default role to the new user
        await client.query(insertUserRoleText, insertUserRoleValues); // Insert the user role

        await client.query('COMMIT'); // Commit the transaction
        return newUser; // Return the newly created user
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback the transaction in case of error
        throw error; // Rethrow the error to be handled by the caller
    } finally {
        client.release(); // Release the database connection
    }
}

/**
 * Deletes a user and their associated roles from the database.
 *
 * @param userId - The ID of the user to delete.
 * @throws Will throw an error if the user is not found or if any database operation fails.
 */
async function deleteUser(userId: number): Promise<void> {
    // Connect to the database client
    const client = await pool.connect();
    try {
        // Begin a transaction
        await client.query('BEGIN');

        // Query to delete the user's roles
        const deleteUserRoleText = 'DELETE FROM user_roles WHERE user_id = $1';
        await client.query(deleteUserRoleText, [userId]);

        // Query to delete the user
        const deleteUserText = 'DELETE FROM users WHERE user_id = $1 RETURNING *';
        const deleteUserResult = await client.query(deleteUserText, [userId]);

        // Check if the user was found and deleted
        if (deleteUserResult.rows.length === 0) {
            throw new Error('User not found.');
        }

        // Commit the transaction
        await client.query('COMMIT');
    } catch (error) {
        // Rollback the transaction in case of any error
        await client.query('ROLLBACK');
        // Rethrow the error to be handled by the caller
        throw error;
    } finally {
        // Release the database client back to the pool
        client.release();
    }
}

/**
 * Updates a user's information in the database.
 *
 * @param userId - The ID of the user to update.
 * @param username - The new username for the user.
 * @param email - The new email for the user.
 * @param password - The new password for the user.
 * @returns The updated user object.
 * @throws Will throw an error if the user is not found or if any database operation fails.
 */
async function updateUser(userId: number, username: string, email: string, password: string): Promise<User> {
    try {
        // Hash the new password
        const hashedPassword = await hashPassword(password);

        // Query to update the user's information
        const result = await pool.query(
            'UPDATE users SET username = $1, email = $2, password_hash = $3 WHERE user_id = $4 RETURNING *',
            [username, email, hashedPassword, userId]
        );

        // Check if the user was found and updated
        if (result.rows.length === 0) {
            throw new Error('User not found.');
        }

        // Return the updated user object
        return result.rows[0];
    } catch (error) {
        // Rethrow the error to be handled by the caller
        throw error;
    }
}

export {
    getUserDataById,
    getUserDataByEmail,
    registerUser,
    deleteUser,
    updateUser
};