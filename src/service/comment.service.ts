import Joi from "joi";

import pool from "../db/db";

export async function getPostComments(postId: any, query: any){
    try {
        const { page, size } = query;

        const limit = size ? size : 5;
        const offset = page ? (page)*limit : 0;

        return await pool.query(
            `SELECT comment.comment, name AS username 
             FROM comment
             INNER JOIN users ON (comment.user_id = users.user_id)
             WHERE comment.post_id = $1
             OFFSET $2 LIMIT $3`,
            [postId,  offset, limit]
        );
    } catch (err) {
        console.log(err);
    }
}

export async function getAllUserComments(user_id: any, query:any){
    try {
        const { page, size } = query;

        const limit = size ? size : 5;
        const offset = page ? (page)*limit : 0;

        return await pool.query(
            "SELECT * FROM comment WHERE user_id = $1 OFFSET $2 LIMIT $3",
            [user_id, offset, limit]
        );
    } catch (err) {
        console.log(err);
    }
}

export async function getComment(commentId: any){
    try {
        return await pool.query(
            "SELECT * FROM comment WHERE comment_id = $1",
            [commentId]
        );
    } catch (err) {
        console.log(err);
    }
}

export async function createComment(comment: any, user_id: any, postId: any){
    try {
        return await pool.query(
            `INSERT INTO comment (comment, user_id, post_id) VALUES ($1, $2, $3) RETURNING *`,
            [comment, user_id, postId]
        );
    } catch (err) {
        console.log(err);
    }
}

export async function updateComment(comment: any, commentId: any){
    try {
        return await pool.query(
            "UPDATE comment SET comment = $1 WHERE comment_id = $2 RETURNING *",
            [comment, commentId]
        );
        
    } catch (err) {
        console.log(err);
    }
}

export async function deleteComment(commentId: any){
    try {
        return  await pool.query(
            "DELETE FROM comment WHERE comment_id = $1 RETURNING *",
            [commentId]
          );            
    } catch (err) {
        console.log(err);
    }
}

export function validateComment(comment: any) {
    const schema = Joi.object({
      comment: Joi.string().min(1).max(1024).required(),
    });
    return schema.validate(comment);
}