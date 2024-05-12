import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.get('/test', (req, res) => {
    res.send('This is a test route');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});