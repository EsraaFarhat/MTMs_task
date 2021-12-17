import { Request, Response } from "express";

import { getAllUserComments, getComment, createComment, updateComment, deleteComment } from "../service/comment.service";
import { findPost } from "../service/post.service";

export async function getAllUserCommentsHandler(req: Request, res: Response){
    try {
        const user_id = (<any>req).user.user_id;

        const comments = await getAllUserComments(user_id);

        if(comments?.rowCount === 0) return res.json({message: "No comments has been created yet!"});

        res.json({comments: comments?.rows});
    } catch (err) {
        console.log(err);
    }
}

export async function getCommentHandler(req: Request, res: Response){
    try {
        const commentId = req.params.commentId;

        const comment = await getComment(commentId);

        if(comment?.rowCount === 0) return res.json({message: "No comment found!"});

        res.json({comment: comment?.rows[0]});
    } catch (err) {
        console.log(err);
    }
}

export async function createCommentHandler(req: Request, res: Response){
    try {
        const postId = req.params.postId;
        const { comment } = req.body;
        const user_id = (<any>req).user.user_id;

        const post = await findPost(postId);

        if(post?.rowCount === 0) return res.status(400).json({message: "Post Not Found!"});

        if(!comment) return res.status(400).json({message: "Comment can't be Empty!"});

        //   Insert comment into database
        const newComment = await createComment(comment, user_id, postId);

        res.json({
            message: "Comment created Successfully",
            comment: newComment?.rows[0],
        });
        
    } catch (err) {
        console.log(err);
    }
}

export async function updateCommentHandler(req: Request, res: Response){
    try {
        const commentId = req.params.commentId;

        const { comment } = req.body;

        if(!comment) return res.status(400).json({message: "Nothing to Update!"});

        const updatedComment = await updateComment(comment, commentId);

        res.json({
            message: "Comment updated Successfully",
            comment: updatedComment?.rows[0],
        });
        
    } catch (err) {
        console.log(err);
    }
}

export async function deleteCommentHandler(req: Request, res: Response){
    try {
        const commentId = req.params.commentId;

        const deletedComment = await deleteComment(commentId);            

          res.json({
            message: "Comment deleted Successfully",
            comment: deletedComment?.rows[0],
          });
        
    } catch (err) {
        console.log(err);
    }
}