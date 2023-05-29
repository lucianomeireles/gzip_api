import { Router } from 'express'
import passport from '../../config/passport.config'
import authRoute from './auth.route'
import booksRoute from './book.route'
import organizationsRoute from './organization.route'
import usersRoute from './user.route'

const jwtConfig = passport.authenticate('jwt', { session: false })
const router = Router()

router.use('/auth', authRoute)
router.use('/orgs', organizationsRoute)
router.use('/users', jwtConfig, usersRoute)
router.use('/books', jwtConfig, booksRoute)

export default router
