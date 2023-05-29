import { Request, Response } from 'express'
import catchAsync from '../../middlewares/catchAsync'
import { IOrganization } from '../../models/organization.model'
import organizationService from '../../services/organization.service'
import Joi from 'joi'
import AppError from '../../utils/appError'
import jwt from 'jsonwebtoken'

export const getOrganizationById = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const organization: IOrganization | null = await organizationService.getOrganizationById(req.params.id)
  if (!organization) res.formatter.notFound('Organization not found')
  return res.formatter.ok(organization)
})

export const createOrganization = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const organizationJoiSchema = Joi.object({
    user: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.optional(),
    },
    org: {
      name: Joi.string().required(),
    },
  })
  const { error } = organizationJoiSchema.validate(req.body)
  if (error) throw new AppError(error.details[0].message, 400)

  const { org, user } = await organizationService.createOrganization(
    {
      ...req.body.org,
    },
    { ...req.body.user },
  )
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, organization: { id: org.id, name: org.name } },
    process.env.JWT_SECRET || 'check-your-env-file',
  )
  return res.formatter.created({ user, token })
})

export const updateOrganization = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const organizationJoiSchema = Joi.object({
    name: Joi.string().required(),
  })
  const { error } = organizationJoiSchema.validate(req.body)
  if (error) throw new AppError(error.details[0].message, 400)

  const updatedOrganization: IOrganization | null = await organizationService.updateOrganization(
    req.params.id,
    req.body,
  )
  if (!updatedOrganization) return res.formatter.notFound('Organization not found')
  return res.formatter.ok(updatedOrganization)
})

export const deleteOrganization = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const deletedOrganization: IOrganization | null = await organizationService.deleteOrganization(req.params.id)
  if (!deletedOrganization) return res.formatter.notFound('Organization not found')
  return res.formatter.ok(deletedOrganization)
})
