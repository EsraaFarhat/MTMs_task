import { Express, Request, Response } from "express";
import _ from "lodash";
import config from "config";

import pool from "../db/db";

export default function (app: Express) {

    // Get all posts with their likes and comments
    app.get("/api/posts", async (req: Request, res: Response) => {
        try {
            const posts = await pool.query(
                "SELECT * FROM post"
            );
    
            res.json({posts: posts.rows});
        } catch (err) {
            console.log(err);
        }
    });
    
    // Get post by id with its likes and comments
    app.get("/api/posts/:postId", async (req: Request, res: Response) => {
        try {
            const postId = req.params.postId;

            const posts = await pool.query(
                "SELECT * FROM post WHERE post_id = $1",
                [postId]
            );
    
            res.json({post: posts.rows[0]});
        } catch (err) {
            console.log(err);
        }

    });

    // Create a post
    app.post("/api/posts", async (req: Request, res: Response) => {
        try {
            const { body, user_id } = req.body;

            //   Insert post into database
            const newPost = await pool.query(
                `INSERT INTO post (body, user_id) VALUES ($1, $2) RETURNING *`,
                [body, user_id]
            );

            res.json({
                message: "Post created Successfully",
                user: _.pick(newPost.rows[0], ["post_id", "body", "created_at"]),
            });
            
        } catch (err) {
            console.log(err)
        }
    });

    // Update a post by id
    app.patch("/api/posts/:postId", (req: Request, res: Response) => {
        
    });

    // Delete a post by id
    app.delete("/api/posts/:postId", (req: Request, res: Response) => {
        
    });
  
}
