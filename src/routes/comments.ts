import { Express, Request, Response } from "express";
import bcrypt from "bcrypt";
import _ from "lodash";

import pool from "../db/db";

export default function (app: Express) {
    // Create a comment on a post
    app.post("/api/posts/:postId/comment", async (req: Request, res: Response) => {
        try {
            const postId = req.params.postId;
            // ! Will get the user_id from the token in the update
            const { comment, user_id } = req.body;

            const post = await pool.query(
                "SELECT * FROM post WHERE post_id = $1",
                [postId]
            );

            if(post.rowCount === 0) return res.status(400).json({message: "Post Not Found!"});

            if(!comment) return res.status(400).json({message: "Comment can't be Empty!"});

            //   Insert comment into database
            const newComment = await pool.query(
                `INSERT INTO comment (comment, user_id, post_id) VALUES ($1, $2, $3) RETURNING *`,
                [comment, user_id, postId]
            );

            res.json({
                message: "Comment created Successfully",
                comment: newComment.rows[0],
            });
            
        } catch (err) {
            console.log(err);
        }
    });
}
