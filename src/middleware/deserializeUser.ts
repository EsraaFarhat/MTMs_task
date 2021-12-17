import { Request, Response, NextFunction } from "express";
import jwt from  "jsonwebtoken";
import config from "config";
import {get} from "lodash";

import { decode } from "../utils/jwt.utils";
import { reIssueAccessToken } from "../service/session.service";

export default async function (req: Request, res: Response, next: NextFunction) {
  const accessToken = get(req, "headers.x-access-token");

  const refreshToken = get(req, "headers.x-refresh");

  if(!accessToken) return next();

  const { decoded, expired } = decode(accessToken);  

  if(decoded){
    (<any>req).user = decoded;

    return next();
  }

  if(expired && refreshToken){
      const newAccessToken = await reIssueAccessToken({refreshToken});

      if(newAccessToken){
        res.setHeader("x-access-token", newAccessToken);

        const { decoded } = decode(newAccessToken);

        (<any>req).user = decoded;
      }
  }

  return next();

};