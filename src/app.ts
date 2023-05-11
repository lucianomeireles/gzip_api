"use strict";

import cors from "cors";
import express from "express";
import { responseEnhancer } from "express-response-formatter";
import session from "express-session";
import helmet from "helmet";
import responseTime from "response-time";
import routes from "./api/routes";
import passport from "./config/passport.config";
import { errorHandler } from "./middlewares/errorHandler";
//import mongooseConfig from "./config/mongoose.config";


const app = express();

//mongooseConfig.connect()

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(responseTime());
app.use(responseEnhancer());

app.use("/", routes);

app.use(errorHandler);

export default app;
