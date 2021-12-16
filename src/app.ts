import pool from './db/db';
import users from './routes/users';
import posts from './routes/posts';


import cors from 'cors';
import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

users(app);
posts(app);

app.listen(port, () => {
    console.log(`listening on port ${port}...`);
});