import { Express } from "express";

import auth from "../middleware/auth";
import { createUserSessionHandler, invalidDateUserSessionHandler } from "../controller/session.controller";


export default function (app: Express) {

    app.post("/api/sessions",  createUserSessionHandler);

    app.delete("/api/sessions", auth, invalidDateUserSessionHandler);

}
