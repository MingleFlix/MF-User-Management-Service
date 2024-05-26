// src/config/db.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER || 'admin',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'user_management_db',
    password: process.env.DB_PASSWORD || 'admin123',
    port: Number(process.env.DB_PORT) || 5432,
});

pool.on('connect', () => {
    console.log('Connected to the database');
});

export default pool;