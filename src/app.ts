import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { httpResponse } from "./api/v1/helpers";
import { authRouter } from "./api/v1/routes/authRoutes";
import { protectedRouter } from "./api/v1/routes/protectedRoutes";

import { routeNotFound } from "./api/v1/middleware/routeNotFound";
import { errorHandler } from "./api/v1/middleware/errorHandler";

import { PORT, BASEURL } from "./config/constants";


import { connectDB } from "./config/db";
import fs from 'fs';
import path from 'path';
// Use express app 
const app = express();


// Define the custom token for logging user ID

// Create the Morgan middleware with the custom format and stream

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// Routes

app.use(`${BASEURL}/auth`, authRouter); 
app.use(`${BASEURL}/protected`, protectedRouter); 

// swaggerDocs(app)


/**
 * @swagger
 * /ok:
 *   get:
 *     tags:
 *       - Healthcheck
 *     summary: Health Check
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 */
app.get("/ok", (_req, res) =>
  res.status(200).send(httpResponse(true, "OK", {}))
);

// Custom middleware
app.use(routeNotFound);
app.use(errorHandler);

export default app;

