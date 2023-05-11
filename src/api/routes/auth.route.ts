import express from "express";
import jwt from "jsonwebtoken";
import passport from "../../config/passport.config";
import { IUser } from "../../models/user.modal";
import AppError from "../../utils/appError";

const router = express.Router();

router.post(
  "/login",
  passport.authenticate("local"),
  async (req, res, next) => {
    passport.authenticate("local", (err: any, user: IUser, info: any) => {
      if (err) throw new AppError(err.details[0].message, 401);
      if (!user) return res.formatter.unauthorized({ message: info.message });
      req.logIn(user, (err) => {
        if (err) throw new AppError(err.details[0].message, 401);
        const token = jwt.sign({ id: user._id }, "jwt-secret");
        return res.formatter.ok({ user: user.email, token });
      });
    })(req, res, next);
  }
);

router.get(
  "/loggedUser",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    res.json({ user: req.user });
  }
);

router.delete("/logout", async (req, res, next) => {
  req.logout(() => {
    req.user = undefined;
    res.status(200).json({ success: true });
  });
});

export default router;
