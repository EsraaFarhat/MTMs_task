import { Request, Response } from "express";
import _ from "lodash";

import { getAllPosts, getPost, createPost, updatePost, deletePost, validatePost } from "../service/post.service";
import { getPostComments } from "../service/comment.service";
import { getPostLikes } from "../service/like.service";

export async function getAllPostsHandler(req: Request, res: Response){
    try {
        const posts = await getAllPosts();

    if(posts?.rowCount === 0) return res.json({message: "No posts has been created yet!"});

        res.json({posts: posts?.rows});
    } catch (err) {
        console.log(err);
    }
}

export async function getPostHandler(req: Request, res: Response){
    try {
        const postId = req.params.postId;

        const post = await getPost(postId);
        
        if(post?.rowCount === 0) return res.status(400).json({message: "Post Not Found!"});

        const comments = await getPostComments(postId);

        const likes = await getPostLikes(postId);

        res.json({
            post: post?.rows[0],
            comments: comments?.rows,
            likes: likes?.rows,
        });
    } catch (err) {
        console.log(err);
    }
}

export async function createPostHandler(req: Request, res: Response){
    try {
        const { error } = validatePost(req.body);
        if (error) return res.status(400).json({message: error.details[0].message });

        //   Insert post into database
        const newPost = await createPost(req);

        res.json({
            message: "Post created Successfully",
            post: _.pick(newPost?.rows[0], ["post_id", "body", "created_at"]),
        });
        
    } catch (err) {
        console.log(err);
    }
}

export async function updatePostHandler(req: Request, res: Response){
    try {
        const { error } = validatePost(req.body);
        if (error) return res.status(400).json({message: error.details[0].message });

        const postId = req.params.postId;
        const { body } = req.body;

        if(!body) return res.status(400).json({message: "Nothing to Update!"});

        const updatedPost = await updatePost(body, postId);

        res.json({
            message: "Post updated Successfully",
            post: _.pick(updatedPost?.rows[0], ["post_id", "body", "created_at"]),
        });

        
    } catch (err) {
        console.log(err);
    }
}

export async function deletePostHandler(req: Request, res: Response){
    try {
        const postId = req.params.postId;

        const deletedPost = await deletePost(postId);            

        res.json({
        message: "Post deleted Successfully",
        post: _.pick(deletedPost?.rows[0], ["post_id", "body", "created_at"]),
        });
        
    } catch (err) {
        console.log(err);
    }
}