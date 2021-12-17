import users from './routes/users';
import sessions from './routes/session';
import posts from './routes/posts';
import comments from './routes/comments';
import likes     from './routes/likes';
import deserializeUser     from './middleware/deserializeUser';


import cors from 'cors';
import express from 'express';
import { Session } from 'inspector';
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(deserializeUser);

users(app);
sessions(app);
posts(app);
comments(app);
likes(app);

app.listen(port, () => {
    console.log(`listening on port ${port}...`);
});