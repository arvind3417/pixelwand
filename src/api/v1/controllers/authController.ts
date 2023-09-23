import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { genAccessToken, genRefreshToken } from "../helpers/jwt";
import { hashPassword, hashCompare } from "../helpers/hashPassword";
import { Session } from "../models/session";
import { User } from "../models/user";
import * as CustomErrors from "../errors";
import asyncWrapper from "../helpers/asyncWrapper";
import { httpResponse } from "../helpers";
import * as validators from "../helpers/validators";
import normalizeModel from "../helpers/normalizer";

const login_FIELDS = [
  { name: "email", validator: validators.isValidEmail, required: true },
  { name: "password", validator: validators.isString, required:true},
];
const register_FIELDS = [
  { name: "name", validator: validators.isString, required: true },
  { name: "email", validator: validators.isValidEmail, required:true },
  { name: "password", validator: validators.isString, default: null,required:true },
];
const logout_FIELDS = [
  { name: "token", validator: validators.isString, required: true },
];
const session_FIELDS = [
  { name: "token", validator: validators.isString, required: true },
  { name: "userId", validator: validators.isObjectId, required: true },

];

export const loginController = asyncWrapper(
  async (_req: Request, _res: Response, _next: NextFunction) => {
    const { email, password } = _req.body;
    if (!email || !password)
    return _next(
  new CustomErrors.BadRequestError("Please provide email and password")
  );
  
  const user = await User.findOne({ email: email });
  if (!user)
  return _next(
new CustomErrors.NotFoundError("Invalid email or user does not exist")
);
     
    if (hashCompare(password, user.password)) {
      const accessToken = genAccessToken(user);
       await Session.create({token: accessToken, userId: user._id });
      _res.status(StatusCodes.OK).json(
        httpResponse(true, "User logged in successfully", {
          accessToken:accessToken, user
        })
      );
    } else {
      // passwords do not match
      return _next(new CustomErrors.UnauthorizedError("Invalid password"));
    }
  }
);


export const registerController = asyncWrapper(
  async (_req: Request, _res: Response, _next: NextFunction) => {
    
    if (
      !_req.body.name ||
      !_req.body.email ||
      !_req.body.password     )
      return _next(
        new CustomErrors.BadRequestError("Please provide all required fields")
        );
        
        let user = await User.findOne({
          email: _req.body.email,
        });
        if (user)
        return _next(new CustomErrors.BadRequestError("User already exists"));
      else {
        try {
        console.log("hi");
        const hashedPassword = hashPassword(_req.body.password);
        
        user = await User.create(normalizeModel({ ..._req.body, password: hashedPassword },register_FIELDS));
        
      } catch (err: any) {
        return _next(
          new CustomErrors.BadRequestError("Invalid user data " + err.message)
        );
      }
      const accessToken = genAccessToken(user);

      const session = await Session.create(normalizeModel({token: accessToken, userId: user._id },session_FIELDS));
  
      _res.status(StatusCodes.CREATED).json(
        httpResponse(true, "User created successfully", {
          accessToken:accessToken,user,session  
            })
      );
    }
  }
);
export const logoutController = asyncWrapper(
  async (_req: Request, _res: Response, _next: NextFunction) => {
    console.log("hiiiidhhsi");
    
    const { token } = _req.headers;
    if (!token)
      return _next(
        new CustomErrors.BadRequestError("Please provide token in header")
        );
        const session = await Session.findOneAndDelete({ token });
        if (!session)
        return _next(new CustomErrors.BadRequestError("Session not found"));
      else {
        try {
        console.log("hi");
        // await session.deleteOne(); 
      } catch (err: any) {
        return _next(
          new CustomErrors.BadRequestError("Invalid user data " + err.message)
        );
      }
      _res.status(StatusCodes.NO_CONTENT).json(
        httpResponse(true, "Logged out successfully", {})
      );
    }
  }
);
