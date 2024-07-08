import swaggerJSDoc from 'swagger-jsdoc';
import path from "node:path";

/*
 * Author: Jesse Günzl
 * Matrikelnummer: 2577166
 */

// Determine the environment
const dev = process.env.NODE_ENV !== 'production';
const apiDocsPath = dev ? './src/routes/*.ts' : './dist/routes/*.js';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User-Management Service',
            version: '1.0.0',
            description: 'Handles user registration, authentication, and profile management',
        },
        // basePath: '/api/user-management/',
    },
    apis: [path.resolve(apiDocsPath)], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
