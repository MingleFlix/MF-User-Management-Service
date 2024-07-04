import pool from "../config/db";
import {Roles} from "../types/userTypes";

export async function getRolesForUser(userId: number): Promise<Roles['role_name'][]> {
    const query = 'SELECT role_name FROM roles INNER JOIN user_roles ON roles.role_id = user_roles.role_id WHERE user_roles.user_id = $1';
    const values = [userId];
    const result = await pool.query(query, values);
    return result.rows.map((row: any) => row.role_name) as Roles['role_name'][];
}