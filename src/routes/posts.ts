import { Express } from "express";

import auth from "../middleware/auth";
import hasPrivilege from "../middleware/hasPrivilege";
import { getAllPostsHandler, getPostHandler, createPostHandler, updatePostHandler, deletePostHandler } from "../controller/post.controller";


export default function (app: Express) {

    // Get all posts 
    app.get("/api/posts", auth, getAllPostsHandler);
    
    // Get post by id with its likes and comments
    app.get("/api/posts/:postId", auth, getPostHandler);

    // Create a post
    app.post("/api/posts", auth, createPostHandler);

    // Update a post by id
    app.patch("/api/posts/:postId", [auth, hasPrivilege], updatePostHandler);

    // Delete a post by id
    app.delete("/api/posts/:postId", [auth, hasPrivilege], deletePostHandler);
  
}
