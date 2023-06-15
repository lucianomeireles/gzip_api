import { Request, Response } from 'express'
import Joi from 'joi'
import catchAsync from '../../middlewares/catchAsync'
import { IUser } from '../../models/user.model'
import userService from '../../services/user.service'
import AppError from '../../utils/appError'

const userJoiSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string(),
})

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const loggedUser = req.user as IUser
  const users = await userService.getUsers(loggedUser.organization.id)
  return res.formatter.ok(users)
})

export const getUserById = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const user: IUser | null = await userService.getUserById(req.params.id)

  if (!user) throw new AppError('User not found', 404)
  return res.formatter.ok(user)
})

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const { error } = userJoiSchema.validate(req.body)
  if (error) throw new AppError(error.details[0].message, 400)

  const loggedUser = req.user as IUser
  const user = await userService.createUser({
    ...req.body,
    organization: loggedUser.organization,
  })
  return res.formatter.created(user)
})

export const updateUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { error } = userJoiSchema.validate(req.body)
  if (error) throw new AppError(error.details[0].message, 400)

  const loggedUser = req.user as IUser
  const updatedUser: IUser | null = await userService.updateUser(loggedUser.organization.id, req.params.id, req.body)
  if (!updatedUser) return res.formatter.notFound('User not found')
  return res.formatter.ok(updatedUser)
})

export const deleteUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const loggedUser = req.user as IUser
  const deletedUser: IUser | null = await userService.deleteUser(loggedUser.organization.id, req.params.id)
  if (!deletedUser) return res.formatter.notFound('User not found')
  return res.formatter.ok(deletedUser)
})
