import { Router } from 'express'

import authRoute from './auth.route'
import usersRoute from './user.route'
import booksRoute from './book.route'
import passport from '../../config/passport.config'

const jwtConfig = passport.authenticate('jwt', { session: false })
const router = Router()

router.use('/auth', authRoute)
router.use('/users', jwtConfig, usersRoute)
router.use('/books', jwtConfig, booksRoute)

export default router
