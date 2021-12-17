import { Request, Response } from "express";
import config from "config";
import {get} from "lodash";

import { createUserSession } from "../service/session.service";
import { validatePassword, generateAccessToken, generateRefreshToken, validateLoginInputs, updateSession } from "../service/session.service";
import { findUser } from "../service/user.service";

export async function createUserSessionHandler(req: Request, res: Response){
    try {
        const { error } = validateLoginInputs(req.body);
        if (error) return res.status(400).json({message: error.details[0].message });

        const { email, password } = req.body;
        const user  = await findUser(email);

        if(user?.rowCount === 0) return res.status(400).json({error: "Invalid email or password!"});

        const validPassword = validatePassword(password, user.rows[0].password);
        if(!validPassword) return res.status(400).json({error: "Invalid email or password!"});
        
        const newSession = await createUserSession(user.rows[0].user_id, req.get("user-agent") || "");

        // Create Access Token
        const accessToken = await generateAccessToken(user.rows[0].user_id, newSession?.rows[0].session_id);

        // Create Refresh token
        const refreshToken = await generateRefreshToken(newSession?.rows[0].session_id);

        res.json({
            message: "Logged In Successfully",
            accessToken,
            refreshToken
      });
        
    } catch (err) {
        console.log(err);
    }
}

export async function invalidDateUserSessionHandler(req: Request, res: Response){
    try {
        const sessionId= get(req, "user.session_id");
        await updateSession(sessionId);
    
        return res.sendStatus(200);
    } catch (err) {
        console.log(err);
    }
}