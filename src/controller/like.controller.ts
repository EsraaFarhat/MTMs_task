import { Request, Response } from "express";

import { findLike, likePost, unlikePost } from "../service/like.service";
import { findPost } from "../service/post.service";

export async function likeHandler(req: Request, res: Response){
    try {
        const postId = req.params.postId;
        const user_id = (<any>req).user.user_id;

        const post = await findPost(postId);

        if(post?.rowCount === 0) return res.status(400).json({message: "Post Not Found!"});

        const like = await findLike(user_id, postId);

        if(like?.rowCount === 0) {
            await likePost(user_id, postId);
            return res.json({
                message: "You liked this post",
            });
        } else{
            await unlikePost(user_id, postId);
            return res.json({
                message: "Unlike this post",
            });
        }
        
    } catch (err) {
        console.log(err);
    }
}
