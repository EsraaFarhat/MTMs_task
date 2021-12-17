CREATE DATABASE MTMs_task;

-- \c MTMs_task

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    password VARCHAR (1024) NOT NULL,
    email VARCHAR (255) UNIQUE NOT NULL,
    birth_date DATE NOT NULL,
    created_at timestamp default now(),
    last_login timestamp
    deleted_at timestamp
);

CREATE FUNCTION soft_delete()  
RETURNS trigger AS $$
DECLARE
    command text := ' SET deleted_at = current_timestamp WHERE user_id = $1';
BEGIN
    EXECUTE 'UPDATE ' || TG_TABLE_NAME || command USING OLD.user_id;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER soft_delete_user  
  BEFORE DELETE ON users
  FOR EACH ROW EXECUTE PROCEDURE soft_delete();

CREATE TABLE post(
    post_id SERIAL PRIMARY KEY,
    body text NOT NULL,
    created_at timestamp default now(),
    user_id Integer REFERENCES users ON DELETE CASCADE
);

CREATE TABLE comment(
    comment_id SERIAL PRIMARY KEY,
    comment text NOT NULL,
    created_at timestamp default now(),
    user_id Integer REFERENCES users ON DELETE CASCADE,
    post_id Integer REFERENCES post ON DELETE CASCADE
);

CREATE TABLE likes(
    like_id SERIAL PRIMARY KEY,
    user_id Integer REFERENCES users ON DELETE CASCADE,
    post_id Integer REFERENCES post ON DELETE CASCADE
);