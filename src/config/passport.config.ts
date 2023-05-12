import bcryptjs from 'bcryptjs'
import dotenv from 'dotenv'
import passport from 'passport'
import passportJWT from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import UserService from '../services/user.service'
import { IUser } from '../models/user.model'
import AppError from '../utils/appError'
dotenv.config()

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password', session: true },
    async (email, password, done) => {
      try {
        const user = await UserService.getUserByEmail(email)

        if (!user) throw new AppError('e-mail or passaword not valid.', 401)
        const isValidPassword = await bcryptjs.compare(password, user.password)
        if (!isValidPassword) throw new AppError('e-mail or passaword not valid.', 401)

        const userResponse = { id: user._id, name: user.name, email: user.email }

        return done(null, userResponse)
      } catch (error) {
        return done(error)
      }
    },
  ),
)

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'check-your-env-file',
    },
    async (jwtPayload: { id: string }, done) => {
      try {
        const user = await UserService.getUserById(jwtPayload.id)
        if (!user) return done(null, false)

        const userResponse = { id: user._id, name: user.name, email: user.email }
        return done(null, userResponse)
      } catch (err) {
        return done(err)
      }
    },
  ),
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user: IUser, done) => {
  done(null, user)
})

export default passport
