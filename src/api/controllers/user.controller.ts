import { NextFunction, Request, Response } from "express";
import catchAsync from "../../middlewares/catchAsync";
import User from "../../models/user";

const getUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();
    res.locals.data = users;
    return next();
  }
);

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.locals.data = user;
    return next();
  }
);

export { createUser, getUsers };

