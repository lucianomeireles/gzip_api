import { Router } from 'express'

import authRoute from './auth'
import usersRoute from './user.route'
import booksRoute from './book.route'
import { authenticateJwt } from '../../middlewares/authenticateJwt'

const router = Router()

router.use('/auth', authRoute)
router.use('/users', authenticateJwt, usersRoute)
router.use('/books', authenticateJwt, booksRoute)

export default router
