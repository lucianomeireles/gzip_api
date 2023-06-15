import { Router } from 'express'
import passport from '../../config/passport.config'
import authRoute from './auth.route'
import bankAccountsRoute from './bankAccount.route'
import organizationsRoute from './organization.route'
import usersRoute from './user.route'

const jwtConfig = passport.authenticate('jwt', { session: false })
const router = Router()

router.use('/auth', authRoute)
router.use('/orgs', organizationsRoute)
router.use('/users', jwtConfig, usersRoute)
router.use('/bank-accounts', jwtConfig, bankAccountsRoute)

export default router
