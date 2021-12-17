import { Request, Response, NextFunction } from "express";
import jwt from  "jsonwebtoken";
import config from "config";

export default function (req: Request, res: Response, next: NextFunction) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({ message: "Access denied. No token provided."});

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    (<any>req).user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: "Invalid token."});
  }
};