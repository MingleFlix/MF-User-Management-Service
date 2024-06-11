import swaggerJSDoc from 'swagger-jsdoc';

// const dev = process.env.NODE_ENV !== 'production';

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
    apis: ['./src/routes/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
