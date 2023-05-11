import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import passportJWT from "passport-jwt";
import { Console } from "console";
import AppError from "../utils/appError";

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password", session: true },
    async (email, password, done) => {
      try {
        if (email !== "contato@lucianomeireles.io" || password != "luciano123")
          throw new AppError("user or password not valid.", 401);

        const user: Express.User = {
          name: "Luciano",
          email: "contato@lucianomeireles.io",
        };
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "jwt-secret",
    },
    async (jwtPayload: any, done: any) => {
      try {
        // Find the user by ID in the database
        const user: Express.User = {
          name: "Luciano",
          email: "contato@lucianomeireles.io",
          password: "luciano",
        };

        // If the user is not found, return false
        if (!user) {
          return done(null, false);
        }

        // Return the user if found
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("serializeUser", user);
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  console.log("deserializeUser", user);
  done(null, user);
});

export default passport;
