import pool from "../db/db";

export async function getPostLikes(postId: any, query: any){
    try {
        const { page, size } = query;

        const limit = size ? size : 5;
        const offset = page ? (page)*limit : 0;

        return await pool.query(
            `SELECT name AS username 
             FROM likes
             INNER JOIN users ON (likes.user_id = users.user_id)
             WHERE likes.post_id = $1
             OFFSET $2 LIMIT $3`,
            [postId, offset, limit]
        );
    } catch (err) {
        console.log(err);
    }
}


export async function findLike(user_id: any, postId: any){
    try {
        return await pool.query(
            `SELECT * FROM likes WHERE user_id = $1 AND post_id = $2`,
            [user_id, postId]
        )
    } catch (err) {
        console.log(err);
    }
}

export async function likePost(user_id: any, postId: any){
    try {
        return await pool.query(
            `INSERT INTO likes (user_id, post_id) VALUES ($1, $2)`,
            [user_id, postId]
        );
    } catch (err) {
        console.log(err);
    }
}

export async function unlikePost(user_id: any, postId: any){
    try {
        return await pool.query(
            `DELETE FROM likes WHERE user_id = $1 AND post_id = $2`,
            [user_id, postId]
        );
    } catch (err) {
        console.log(err);
    }
}