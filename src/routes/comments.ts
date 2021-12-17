import { Express } from "express";

import auth from "../middleware/auth";
import hasPrivilege from "../middleware/hasPrivilege";
import { getAllUserCommentsHandler, getCommentHandler, createCommentHandler, updateCommentHandler, deleteCommentHandler } from "../controller/comment.controller";


export default function (app: Express) {

    // Get all comments belong to the logged in user
    app.get("/api/comments", auth, getAllUserCommentsHandler);

    // Get comment by Id
    app.get("/api/comments/:commentId", auth, getCommentHandler);

    // Create a comment on a post
    app.post("/api/comments/:postId", auth, createCommentHandler);

    // Update a comment by id
    app.patch("/api/comments/:commentId", [auth, hasPrivilege], updateCommentHandler);

    // Delete a comment by id
    app.delete("/api/comments/:commentId", [auth, hasPrivilege], deleteCommentHandler);

}
