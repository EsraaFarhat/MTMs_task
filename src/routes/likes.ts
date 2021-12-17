import { Express } from "express";

import auth from "../middleware/auth";
import { likeHandler } from "../controller/like.controller";


export default function (app: Express) {
    /* like and unlike a post
    ** If user presses the like button for the first time it will create a record in like table
    ** If user presses the like button again on the same post it will delete the record from the table
    */
    app.post("/api/likes/:postId", auth, likeHandler);

}
