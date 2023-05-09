import bcryptjs from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import catchAsync from "../../middlewares/catchAsync";
import User from "../../models/user";
import AppError from "../../utils/appError";

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) throw new AppError("Invalid email or password", 404);
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) throw new AppError("Invalid email or password", 404);

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    res.locals.data = token;
    return next();
  }
);

export { login };
