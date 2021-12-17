import { Request, Response, NextFunction } from "express";
import jwt from  "jsonwebtoken";
import config from "config";

export default function (req: Request, res: Response, next: NextFunction) {
    
    let token = req.header("x-access-token");
    if(res.getHeader("x-access-token")){
        token = <string>res.getHeader("x-access-token");
    }

    if (!token) return res.status(401).json({ message: "Access denied. No token provided."});

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    (<any>req).user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: "Invalid token."});
  }
};