import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';
import router from "./routes/users";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/', router);
app.use('*', (req: Request, res: Response) => {
    res.status(404).json({ message: 'user-management: Route not found' });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});