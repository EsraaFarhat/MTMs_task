import { Request, Response } from "express";
import _ from "lodash";

import { createUser, deleteUser, restoreUser } from "../service/user.service";

export async function createUserHandler(req: Request, res: Response){
    try {
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

        const restoredUser = await restoreUser(userId);

          res.json({
            message: "User restored Successfully",
            user: _.pick(restoredUser?.rows[0], ["name", "email", "birth_date", "created_at"]),
          });
        
    } catch (err) {
        console.log(err);
    }
}

