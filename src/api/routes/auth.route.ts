import dotenv from 'dotenv'
import express from 'express'
import jwt from 'jsonwebtoken'
import passport from '../../config/passport.config'
import { IUserDocument } from '../../models/user.model'
dotenv.config()

const router = express.Router()

router.post('/login', passport.authenticate('local'), async (req, res, next) => {
  passport.authenticate('local', (err: Error, user: IUserDocument) => {
    if (err) return res.formatter.unauthorized({ message: err.message })
    if (!user) return res.formatter.unauthorized({ message: 'e-mail or passaword not valid.' })
    req.logIn(user, (err) => {
      if (err) return res.formatter.unauthorized({ message: err.details[0].message })
      const token = jwt.sign(user, process.env.JWT_SECRET || 'check-your-env-file')
      return res.formatter.ok({ user: user, token })
    })
  })(req, res, next)
})

router.get('/loggedUser', passport.authenticate('jwt', { session: false }), async (req, res) => {
  return res.formatter.ok(req.user)
})

router.delete('/logout', async (req, res) => {
  req.logout(() => {
    req.user = undefined
    res.status(200).json({ success: true })
  })
})

export default router
