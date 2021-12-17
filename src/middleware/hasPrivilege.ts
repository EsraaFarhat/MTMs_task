import { Request, Response, NextFunction } from "express";

import pool from "../db/db";

export default async function (req: Request, res: Response, next: NextFunction) {
    const postId = req.params.postId;

    if(postId){
        const post = await pool.query(
            "SELECT * FROM post WHERE post_id = $1",
            [postId]
        );

        if(post.rowCount === 0) return res.status(400).json({message: "Post Not Found!"});
    
        if(post.rows[0].user_id === (<any>req).user.user_id) return next();
    }
  
    const commentId = req.params.commentId;

    if(commentId){
        const comment = await pool.query(
            "SELECT * FROM comment WHERE comment_id = $1",
            [commentId]
        );
        if(comment.rowCount === 0) return res.status(400).json({message: "Comment Not Found!"});
    
        if(comment.rows[0].user_id === (<any>req).user.user_id) return next();
    }
  
    return res
      .status(403)
      .send({ message: "You don't have the privilege to perform this action." });
  };
