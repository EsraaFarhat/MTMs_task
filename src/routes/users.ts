import { Express } from "express";

import auth from "../middleware/auth";
import { createUserHandler, deleteUserHandler, restoreUserHandler } from "../controller/user.controller";
import { createUserSessionHandler } from "../controller/session.controller";

export default function (app: Express) {

    // User Signup
  app.post("/api/users/signup",  createUserHandler);
  
    //   User Login
    app.post("/api/users/login", createUserSessionHandler);

      // Delete a user (Soft delete)
    app.delete("/api/users/:userId", auth, deleteUserHandler);

      // Restore a user
      app.patch("/api/users/:userId", auth, restoreUserHandler);
}
