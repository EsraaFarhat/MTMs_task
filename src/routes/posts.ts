import { Express, Request, Response } from "express";
import _ from "lodash";
import config from "config";

import pool from "../db/db";

export default function (app: Express) {

    // Get all posts with their likes and comments
    app.get("/api/posts", async (req: Request, res: Response) => {
        const posts = await pool.query(
            "SELECT * FROM post"
        );
        
        res.json({posts: posts.rows});
    });
    
    // Get post by id with its likes and comments
    app.get("/api/posts/:postId", (req: Request, res: Response) => {
        
    });

    // Create a post
    app.post("/api/posts", (req: Request, res: Response) => {
        
    });

    // Update a post by id
    app.patch("/api/posts/:postId", (req: Request, res: Response) => {
        
    });

    // Delete a post by id
    app.delete("/api/posts/:postId", (req: Request, res: Response) => {
        
    });
  
}
