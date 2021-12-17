import jwt from "jsonwebtoken";
import config from "config";
import bcrypt from "bcrypt";
import Joi from "joi";
import {get} from "lodash";

import pool from "../db/db";
import { decode } from "../utils/jwt.utils";
import { findUserByID } from "./user.service";

export async function createUserSession(user_id:any, user_agent: string) {
    try {
        const session = await pool.query(
            `INSERT INTO session (user_agent, user_id) VALUES ($1, $2) RETURNING *`,
            [user_agent, user_id]
        );

        return session;
        
    } catch (err) {
        console.log(err);
    }
}

export async function validatePassword(password: any, userPassword: any){
    try{
        return await bcrypt.compare(password, userPassword);
    } catch (err) {
        console.log(err);
    }
}

export async function generateAccessToken(user_id: any, session_id: any){
    try {
        const accessToken = jwt.sign(
          {user_id, session_id},
          config.get("jwtPrivateKey"),
          {expiresIn: config.get("accessTokenTtl")},
        );
        return accessToken;
    } catch (err) {
      console.log(err);
    }
}

export async function generateRefreshToken( session_id: any){
    try {
        const refreshToken = jwt.sign(
          { session_id},
          config.get("jwtPrivateKey"),
          {expiresIn: config.get("refreshTokenTtl")},
        );
        return refreshToken;
    } catch (err) {
      console.log(err);
    }
}
      
export function validateLoginInputs(user: any) {
    const schema = Joi.object({
      password: Joi.string().min(5).max(255).required(),
      email: Joi.string().min(5).max(255).required().email(),
    });
    return schema.validate(user);
  }
  
export async function reIssueAccessToken({refreshToken} : {refreshToken: string}){
    try {
        const { decoded } = decode(refreshToken);
    
        if(!decoded || !get(decoded, "session_id")) return false;
    
        const session = await pool.query(
            "SELECT * FROM session WHERE session_id = $1",
            [get(decoded, "session_id")]
        );
    
        if(session?.rowCount === 0 || !session.rows[0]?.valid) return false;
    
        const user = await findUserByID(session.rows[0]?.user_id);
    
        if(user?.rowCount === 0) return false;
    
        const accessToken = await generateAccessToken(user.rows[0]?.user_id, session.rows[0]?.session_id);
    
        return accessToken;
        
    } catch (err) {
        console.log(err);
    }

}

export async function updateSession(session_id: any){
    try {
        return await pool.query(
            "UPDATE session SET valid = false WHERE session_id = $1 RETURNING *",
            [session_id]
        );
    } catch (error) {
        console.log(error);
    }
}