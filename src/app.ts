import pool from './db/db';
import users from './routes/users';
import posts from './routes/posts';
import comments from './routes/comments';
import likes     from './routes/likes';


import cors from 'cors';
import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

users(app);
posts(app);
comments(app);
likes   (app);

app.listen(port, () => {
    console.log(`listening on port ${port}...`);
});