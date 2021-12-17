import { Express, Request, Response } from "express";
import _ from "lodash";

import pool from "../db/db";
import auth from "../middleware/auth";

export default function (app: Express) {
    /* like and unlike a post
    ** If user presses the like button for the first time it will create a record in like table
    ** If user presses the like button again on the same post it will delete the record from the table
    */
    app.post("/api/likes/:postId", auth, async (req: Request, res: Response) => {
        try {
            const postId = req.params.postId;
            const user_id = (<any>req).user.user_id;

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
