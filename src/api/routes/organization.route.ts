import express from 'express'
import passport from 'passport'
import {
  createOrganization,
  deleteOrganization,
  getOrganizationById,
  updateOrganization,
} from '../controllers/organization.controller'

const jwtConfig = passport.authenticate('jwt', { session: false })
const router = express.Router()

router.get('/:id', jwtConfig, getOrganizationById)
router.post('/', createOrganization)
router.put('/:id', jwtConfig, updateOrganization)
router.delete('/:id', jwtConfig, deleteOrganization)

export default router
