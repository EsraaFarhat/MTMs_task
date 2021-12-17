import { Request, Response } from "express";
import _ from "lodash";

import { findUser, createUser, deleteUser, restoreUser, validateUser, findUserByID } from "../service/user.service";

export async function createUserHandler(req: Request, res: Response){
    try {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).json({message: error.details[0].message });

        const user  = await findUser(req.body.email);
        
        if(user.rows[0]) return res.status(400).json({message: "User already exists!" });

        const newUser = await createUser(req.body);

        res.json({
            message: "User created Successfully",
            user: _.pick(newUser?.rows[0], ["name", "email", "birth_date", "created_at"]),
          });
        
    } catch (err) {
        console.log(err);
    }
}

export async function deleteUserHandler(req: Request, res: Response){
        try {
            const userId = req.params.userId;

            const user  = await findUserByID(userId);
            if(user?.rowCount === 0) return res.status(400).json({message: "User Not Found!"});

            const deletedUser = await deleteUser(userId);      

              res.json({
                message: "User deleted Successfully",
              });
            
        } catch (err) {
            console.log(err);
        }
}

export async function restoreUserHandler(req: Request, res: Response){
    try {
        const userId = req.params.userId;
        
        const user  = await findUserByID(userId);
        if(user?.rowCount === 0) return res.status(400).json({message: "User Not Found!"});

        const restoredUser = await restoreUser(userId);

          res.json({
            message: "User restored Successfully",
            user: _.pick(restoredUser?.rows[0], ["name", "email", "birth_date", "created_at"]),
          });
        
    } catch (err) {
        console.log(err);
    }
}

