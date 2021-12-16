CREATE DATABASE MTMs_task;

-- \c MTMs_task

CREATE TABLE "user"(
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    password VARCHAR (1024) NOT NULL,
    email VARCHAR (255) UNIQUE NOT NULL,
    birth_date DATE NOT NULL,
    created_at timestamp default now(),
    last_login timestamp
);

CREATE TABLE post(
    post_id SERIAL PRIMARY KEY,
    body text NOT NULL,
    created_at timestamp default now(),
    user_id Integer REFERENCES "user" ON DELETE CASCADE
);

CREATE TABLE comment(
    comment_id SERIAL PRIMARY KEY,
    comment text NOT NULL,
    created_at timestamp default now(),
    user_id Integer REFERENCES "user" ON DELETE CASCADE,
    post_id Integer REFERENCES post ON DELETE CASCADE
);

CREATE TYPE like_values AS ENUM ('1', '-1');

-- Value 1 for like and -1 for dislike
CREATE TABLE "like"(
    like_id SERIAL PRIMARY KEY,
    like_value like_values,
    user_id Integer REFERENCES "user" ON DELETE CASCADE,
    post_id Integer REFERENCES post ON DELETE CASCADE
);