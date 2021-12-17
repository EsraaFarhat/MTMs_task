import Joi from "joi";

import pool from "../db/db";

export async function getAllPosts(query:any){
    try {
        const { page, size } = query;

        const limit = size ? size : 5;
        const offset = page ? (page)*limit : 0;

        return await pool.query(
            "SELECT * FROM post OFFSET $1 LIMIT $2",
            [offset, limit]
        );
    } catch (err) {
        console.log(err);
    }
}

export async function findPost(postId: any){
    try {
        return await pool.query(
            `SELECT *
             FROM post
             WHERE post.post_id = $1`,
            [postId]
        );
    } catch (err) {
        console.log(err);
    }
}

export async function getPost(postId: any){
    try {
        return await pool.query(
            `SELECT post.*, count(like_id) AS likes
             FROM post
             LEFT JOIN likes ON (post.post_id = likes.post_id)
             GROUP BY post.post_id
             HAVING post.post_id = $1`,
            [postId]
        );
    } catch (err) {
        console.log(err);
    }
}

export async function createPost(req: any){
    try {
        const { body } = req.body;
        const user_id = (<any>req).user.user_id;

        return await pool.query(
            `INSERT INTO post (body, user_id) VALUES ($1, $2) RETURNING *`,
            [body, user_id]
        );
    } catch (err) {
        console.log(err);
    }
}

export async function updatePost(body: any, postId: any){
    try {
        return await pool.query(
            "UPDATE post SET body = $1 WHERE post_id = $2 RETURNING *",
            [body, postId]
        )
        
    } catch (err) {
        console.log(err);
    }
}

export async function deletePost(postId: any){
    try {
        return await pool.query(
            "DELETE FROM post WHERE post_id = $1 RETURNING *",
            [postId]
          );            
    } catch (err) {
        console.log(err);
    }
}

export function validatePost(post: any) {
    const schema = Joi.object({
      body: Joi.string().min(1).max(1024).required(),
    });
    return schema.validate(post);
}