import express from "express";

import {
  authenticateToken
} from "../middleware/authToken";
import * as CustomError from "../errors";

export const protectedRouter = express.Router();

protectedRouter.route("/").get(authenticateToken);

// fallback route
protectedRouter.use((_req, _res, _next) => {
  _next(new CustomError.ForbiddenError("Only POST requests are allowed"));
});
