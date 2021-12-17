import { Express, Request, Response } from "express";
import _ from "lodash";

import pool from "../db/db";

export default function (app: Express) {
    /* like and unlike a post
    ** If user presses the like button for the first time it will create a record in like table with value 1
    ** If user presses the like button again it will reverse the value evert time he presses the button
    */

    app.post("/api/likes/:postId", async (req: Request, res: Response) => {
        try {
            const postId = req.params.postId;
            // ! Will get the user_id from the token in the update
            const { user_id } = req.body;

            const post = await pool.query(
                "SELECT * FROM post WHERE post_id = $1",
                [postId]
            );

            if(post.rowCount === 0) return res.status(400).json({message: "Post Not Found!"});

            const like = await pool.query(
                `SELECT * FROM "like" WHERE user_id = $1 AND post_id = $2`,
                [user_id, postId]
            );

            if(like.rowCount === 0) {
                await pool.query(
                    `INSERT INTO "like" (user_id, post_id) VALUES ($1, $2)`,
                    [user_id, postId]
                );
                return res.json({
                    message: "You liked this post",
                });
            } else{
                await pool.query(
                    `DELETE FROM "like" WHERE user_id = $1 AND post_id = $2`,
                    [user_id, postId]
                );
                return res.json({
                    message: "Unlike this post",
                });
            }
            
        } catch (err) {
            console.log(err);
        }
    });

}
