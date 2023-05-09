"use strict";

import express, { NextFunction, Request, Response } from "express";
import routes from "./api/routes";
import helmet from "helmet";
import cors from "cors";
import mongooseConfig from "./config/mongoose.config";

import { successHandler } from "./middlewares/successHandler";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

mongooseConfig.connect();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/", routes);

app.use(errorHandler);
app.use(successHandler);


export default app;
