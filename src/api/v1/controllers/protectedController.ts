import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Session } from "../models/session";
import { User } from "../models/user";
import * as CustomErrors from "../errors";
import asyncWrapper from "../helpers/asyncWrapper";
import { httpResponse } from "../helpers";
import * as validators from "../helpers/validators";
import normalizeModel from "../helpers/normalizer";

export const getUser = asyncWrapper(
    async (_req: Request, _res: Response, _next: NextFunction) => {
      
    const uid = (<any>_req).user.userId;
    const user = await User.findById({_id :uid});
      if (!user)
        return _next(
          new CustomErrors.BadRequestError("User not found")
          );

        else {
          try {
        } catch (err: any) {
          return _next(
            new CustomErrors.BadRequestError("Invalid user data " + err.message)
          );
        }
        _res.status(StatusCodes.OK).json(
          httpResponse(true, "User Retrieved Successfully", {user})
        );
      }
    }
  );
  