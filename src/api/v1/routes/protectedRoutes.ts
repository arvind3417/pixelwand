import express from "express";

import {
  authenticateToken
} from "../middleware/authToken";
import * as CustomError from "../errors";
import { getUser } from "../controllers/protectedController";

export const protectedRouter = express.Router();

protectedRouter.route("/").get(authenticateToken,getUser);

// fallback route
protectedRouter.use((_req, _res, _next) => {
  _next(new CustomError.ForbiddenError("Only POST requests are allowed"));
});
