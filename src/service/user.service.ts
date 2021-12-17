import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "config";

import pool from "../db/db";


export async function createUser(input: any){
    try {
        const { name, password, email, birth_date } = input;

    //   hash user's password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

    //   Insert user into database
        const newUser = await pool.query(
        `INSERT INTO users (name, password, email, birth_date) VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, hashedPassword, email, birth_date]
        );

        return newUser;

    } catch (err) {
        console.log(err);
    }
}

export async function findUser(email: any){
//   Check if user exists 
const user = await pool.query(
    `SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL`,
    [email]
  );

  return user;
}

export async function validatePassword(password: any, userPassword: any){
    return await bcrypt.compare(password, userPassword);
}

export async function generateAccessToken(user_id: any){
    try {
        const accessToken = jwt.sign(
          {user_id},
          config.get("jwtPrivateKey")
          );
        return accessToken;
    } catch (err) {
      console.log(err);
    }
}

export async function deleteUser(userId: any){
    try{
        await pool.query(
            `DELETE FROM users WHERE user_id = $1`,
            [userId]
          );
    } catch (err) {
        console.log(err);
      }
}

export async function restoreUser(userId: any){
    try{
        return await pool.query(
            `UPDATE users SET deleted_at = null WHERE user_id = $1 RETURNING *`,
            [userId]
          );    
    } catch (err) {
        console.log(err);
      }     
}