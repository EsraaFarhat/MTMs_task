import { Request, Response, NextFunction } from "express";

import pool from "../db/db";
import { findPost } from "../service/post.service";
import { getComment } from "../service/comment.service";

export default async function (req: Request, res: Response, next: NextFunction) {
    const postId = req.params.postId;

    if(postId){
        const post = await findPost(postId);

        if(post?.rowCount === 0) return res.status(400).json({message: "Post Not Found!"});
    
        if(post?.rows[0].user_id === (<any>req).user.user_id) return next();
    }
  
    const commentId = req.params.commentId;

    if(commentId){
        const comment = await getComment(commentId);
        if(comment?.rowCount === 0) return res.status(400).json({message: "Comment Not Found!"});
    
        if(comment?.rows[0].user_id === (<any>req).user.user_id) return next();
    }
  
    return res
      .status(403)
      .send({ message: "You don't have the privilege to perform this action." });
  };
