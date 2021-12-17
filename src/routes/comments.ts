import { Express, Request, Response } from "express";
import _ from "lodash";

import pool from "../db/db";
import auth from "../middleware/auth";

export default function (app: Express) {

    // Get all comments belong to the logged in user
    app.get("/api/comments", auth, async (req: Request, res: Response) => {
        try {
            const user_id = (<any>req).user.user_id;

            const comments = await pool.query(
                "SELECT * FROM comment WHERE user_id = $1",
                [user_id]
            );

        if(comments.rowCount === 0) return res.json({message: "No comments has been created yet!"});
    
            res.json({comments: comments.rows});
        } catch (err) {
            console.log(err);
        }
    });

    // Get comment by Id
    app.get("/api/comments/:commentId", auth, async (req: Request, res: Response) => {
        try {
            const commentId = req.params.commentId;

            const comment = await pool.query(
                "SELECT * FROM comment WHERE comment_id = $1",
                [commentId]
            );

        if(comment.rowCount === 0) return res.json({message: "No comment found!"});
    
            res.json({comment: comment.rows[0]});
        } catch (err) {
            console.log(err);
        }
    });

    // Create a comment on a post
    app.post("/api/comments/:postId", auth, async (req: Request, res: Response) => {
        try {
            const postId = req.params.postId;
            const { comment } = req.body;
            const user_id = (<any>req).user.user_id;

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

    // Update a comment by id
    app.patch("/api/comments/:commentId", auth, async (req: Request, res: Response) => {
        try {
            const commentId = req.params.commentId;

            const { comment } = req.body;

            const oldComment = await pool.query(
                "SELECT * FROM comment WHERE comment_id = $1",
                [commentId]
            );

            if(oldComment.rowCount === 0) return res.status(400).json({message: "Comment Not Found!"});

            if(!comment) return res.status(400).json({message: "Nothing to Update!"});

            const updatedComment = await pool.query(
                "UPDATE comment SET comment = $1 WHERE comment_id = $2 RETURNING *",
                [comment, commentId]
            );

            res.json({
                message: "Comment updated Successfully",
                comment: updatedComment.rows[0],
            });

            
        } catch (err) {
            console.log(err);
        }
    });

    // Delete a comment by id
    app.delete("/api/comments/:commentId", auth, async (req: Request, res: Response) => {
        try {
            const commentId = req.params.commentId;

            const comment = await pool.query(
                "SELECT * FROM comment WHERE comment_id = $1",
                [commentId]
            );

            if(comment.rowCount === 0) return res.status(400).json({message: "Comment Not Found!"});

            const deletedComment = await pool.query(
                "DELETE FROM comment WHERE comment_id = $1 RETURNING *",
                [commentId]
              );            

              res.json({
                message: "Comment deleted Successfully",
                comment: deletedComment.rows[0],
              });
            
        } catch (err) {
            console.log(err);
        }
    });

}
