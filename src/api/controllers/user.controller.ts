import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'
import catchAsync from '../../middlewares/catchAsync'
import { IUser } from '../../models/user'
import UserService from '../../services/user.service'
import AppError from '../../utils/appError'

const getUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  res.locals.data = await UserService.getUsers()
  return next()
})

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })

  const { error } = schema.validate(req.body)
  if (error) throw new AppError(error.details[0].message, 400)
  const user: IUser = await UserService.createUser({
    name,
    email,
    password,
  })

  res.locals.data = user
  return next()
})

export { createUser, getUsers }
