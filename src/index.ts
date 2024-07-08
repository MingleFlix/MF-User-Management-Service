import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import cookieParser from "cookie-parser";
import swaggerSpec from './swagger';
import router from "./routes/users";

/*
 * Author: Jesse Günzl
 * Matrikelnummer: 2577166
 */

dotenv.config(); // Load environment variables from .env file into process.env

const app = express(); // Initialize an Express application
const PORT = process.env.PORT || 3000; // Define the port to run the server on

app.use(express.json()); // Middleware to parse JSON bodies

// Use cookie-parser middleware to parse cookies attached to the client request object
app.use(cookieParser());

// Serve Swagger UI on '/api-docs' route with our Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use the router from './routes/users' for handling routes starting with '/'
app.use('/', router);

// Catch-all route handler for any request that doesn't match the routes defined above
app.use('*', (req: Request, res: Response) => {
    res.status(404).json({message: 'user-management: Route not found'});
});

// Start the server and listen on the defined PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});