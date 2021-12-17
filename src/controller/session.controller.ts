import { Request, Response } from "express";
import _ from "lodash";

// import { createUserSession } from "../service/session.service";
import { findUser, validatePassword, generateAccessToken, validateLoginInputs } from "../service/user.service";

export async function createUserSessionHandler(req: Request, res: Response){
    try {
        const { error } = validateLoginInputs(req.body);
        if (error) return res.status(400).json({message: error.details[0].message });

        const { email, password } = req.body;
        const user  = await findUser(email);

        if(user?.rowCount === 0) return res.status(400).json({error: "Invalid email or password!"});

        const validPassword = validatePassword(password, user.rows[0].password);
        if(!validPassword) return res.status(400).json({error: "Invalid email or password!"});

        const accessToken = await generateAccessToken(user.rows[0].user_id);

        // const newSession = await createUserSession(req.body);

        res.json({
            message: "Logged In Successfully",
            accessToken
      });
        
    } catch (err) {
        console.log(err);
    }
}
