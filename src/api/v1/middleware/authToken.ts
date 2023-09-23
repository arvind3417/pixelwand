import { NextFunction, Request, Response } from "express";
import { jwtUtils } from "../helpers";

import * as CustomError from "../errors";
import { Session } from "../models/session";

export const authenticateToken = async (
  _req: Request,
  _res: Response,
  _next: NextFunction
) => {
  const authHeader = _req.headers["authorization"];
  const token:string|undefined = authHeader && authHeader.split(" ")[1];

  if (token == null)
    return _next(new CustomError.ForbiddenError("No token provided"));

  try {
    const session = await Session.findOne({ token });
    if (!session) {
      return _res.status(401).json({ message: 'Authentication failed' });
    }
    if (session.expiresAt < new Date()) {
      return _res.status(404).json({ error: 'Session token has expired' });
    }
    const decoded = jwtUtils.verifyAccessToken(token);
    console.log(decoded);
    
    (<any>_req).user = decoded;
    (<any>_req).access_token = token;
    _next();
  } catch (err: any) {
    _next(new CustomError.UnauthorizedError(err.message));
  }
};
