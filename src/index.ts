import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import UserController from './controllers/userController';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/register', UserController.register);
app.post('/login', UserController.login);

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.get('/test', (req, res) => {
    res.send('This is a test route');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});