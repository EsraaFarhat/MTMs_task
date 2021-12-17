import { Express, Request, Response } from "express";
import _ from "lodash";

import pool from "../db/db";
import auth from "../middleware/auth";
import hasPrivilege from "../middleware/hasPrivilege";

export default function (app: Express) {

    // Get all posts with their likes and comments
    app.get("/api/posts", auth, async (req: Request, res: Response) => {
        try {
            const posts = await pool.query(
                "SELECT * FROM post"
            );

        if(posts.rowCount === 0) return res.json({message: "No posts has been created yet!"});
    
            res.json({posts: posts.rows});
        } catch (err) {
            console.log(err);
        }
    });
    
    // Get post by id with its likes and comments
    app.get("/api/posts/:postId", auth, async (req: Request, res: Response) => {
        try {
            const postId = req.params.postId;

            const post = await pool.query(
                "SELECT * FROM post WHERE post_id = $1",
                [postId]
            );
    
            if(post.rowCount === 0) return res.status(400).json({message: "Post Not Found!"});

            res.json({post: post.rows[0]});
        } catch (err) {
            console.log(err);
        }

    });

    // Create a post
    app.post("/api/posts", auth, async (req: Request, res: Response) => {
        try {
            const { body } = req.body;
            const user_id = (<any>req).user.user_id;

            //   Insert post into database
            const newPost = await pool.query(
                `INSERT INTO post (body, user_id) VALUES ($1, $2) RETURNING *`,
                [body, user_id]
            );

            res.json({
                message: "Post created Successfully",
                post: _.pick(newPost.rows[0], ["post_id", "body", "created_at"]),
            });
            
        } catch (err) {
            console.log(err);
        }
    });

    // Update a post by id
    app.patch("/api/posts/:postId", [auth, hasPrivilege], async (req: Request, res: Response) => {
        try {
            const postId = req.params.postId;

            const { body } = req.body;

            if(!body) return res.status(400).json({message: "Nothing to Update!"});

            const updatedPost = await pool.query(
                "UPDATE post SET body = $1 WHERE post_id = $2 RETURNING *",
                [body, postId]
            );

            res.json({
                message: "Post updated Successfully",
                post: _.pick(updatedPost.rows[0], ["post_id", "body", "created_at"]),
            });

            
        } catch (err) {
            console.log(err);
        }
    });

    // Delete a post by id
    app.delete("/api/posts/:postId", [auth, hasPrivilege], async (req: Request, res: Response) => {
        try {
            const postId = req.params.postId;

            const deletedPost = await pool.query(
                "DELETE FROM post WHERE post_id = $1 RETURNING *",
                [postId]
              );            

              res.json({
                message: "Post deleted Successfully",
                post: _.pick(deletedPost.rows[0], ["post_id", "body", "created_at"]),
              });
            
        } catch (err) {
            console.log(err);
        }
    });
  
}
