import { Express, Request, Response } from "express";
import bcrypt from "bcrypt";
import _ from "lodash";

import pool from "../db/db";

export default function (app: Express) {

    // User Signup
  app.post("/api/users/signup", async (req: Request, res: Response) => {
    try {
      const { name, password, email, birth_date } = req.body;

    //   hash user's password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

    //   Insert user into database
      const newUser = await pool.query(
        `INSERT INTO "user" (name, password, email, birth_date) VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, hashedPassword, email, birth_date]
      );

      res.json({
        message: "User created Successfully",
        user: _.pick(newUser.rows[0], ["name", "email", "birth_date", "created_at"]),
      });
    } catch (err) {
      console.log(err);
    }
  });
  
}
