import pool from "../config/db";
import {Roles} from "../types/userTypes";

/*
 * Author: Jesse Günzl
 * Matrikelnummer: 2577166
 */

/**
 * Fetches the roles for a given user by their user ID.
 *
 * @param userId The ID of the user whose roles are to be fetched.
 * @returns An array of role names associated with the user.
 */
export async function getRolesForUser(userId: number): Promise<Roles['role_name'][]> {
    // SQL query to select role names by joining the roles and user_roles tables
    // where the user ID matches the given userId
    const query = 'SELECT role_name FROM roles INNER JOIN user_roles ON roles.role_id = user_roles.role_id WHERE user_roles.user_id = $1';
    const values = [userId]; // Parameters for the SQL query, to prevent SQL injection
    const result = await pool.query(query, values); // Execute the query with the provided values
    // Map the result rows to an array of role names and return
    return result.rows.map((row: any) => row.role_name) as Roles['role_name'][];
}