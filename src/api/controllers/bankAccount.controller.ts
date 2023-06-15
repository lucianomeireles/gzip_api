import { Request, Response } from 'express'
import Joi from 'joi'
import catchAsync from '../../middlewares/catchAsync'
import { IBankAccount } from '../../models/bankAccount.model'
import { IUser } from '../../models/user.model'
import bankAccountService from '../../services/bankAccount.service'
import AppError from '../../utils/appError'

export const getBankAccounts = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const loggedUser = req.user as IUser
  const bankAccounts: IBankAccount[] = await bankAccountService.getBankAccounts(loggedUser.organization.id)
  return res.formatter.ok(bankAccounts)
})

export const getBankAccountById = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const loggedUser = req.user as IUser
  const bankAccount: IBankAccount | null = await bankAccountService.getBankAccountById(
    loggedUser.organization.id,
    req.params.id,
  )
  if (!bankAccount) return res.formatter.notFound('Bank Account not found')
  return res.formatter.ok(bankAccount)
})

export const createBankAccount = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const bankAccountJoiSchema = Joi.object({
    accountNumber: Joi.string().required(),
    bankName: Joi.string().required(),
    balance: Joi.number().default(0),
  })
  const { error } = bankAccountJoiSchema.validate(req.body)
  if (error) throw new AppError(error.details[0].message, 400)

  const loggedUser = req.user as IUser
  const bankAccount = await bankAccountService.createBankAccount({
    ...req.body,
    organization: loggedUser.organization,
  })

  return res.formatter.created(bankAccount)
})

export const updateBankAccount = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const bankAccountJoiSchema = Joi.object({
    accountNumber: Joi.string().required(),
    bankName: Joi.string().required(),
  })

  const { error } = bankAccountJoiSchema.validate(req.body)
  if (error) throw new AppError(error.details[0].message, 400)

  const loggedUser = req.user as IUser
  const updatedBankAccount: IBankAccount | null = await bankAccountService.updateBankAccount(
    loggedUser.organization.id,
    req.params.id,
    req.body,
  )
  if (!updatedBankAccount) return res.formatter.notFound('Bank Account not found')
  return res.formatter.ok(updatedBankAccount)
})

export const deleteBankAccount = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const loggedUser = req.user as IUser
  const deletedBankAccount: IBankAccount | null = await bankAccountService.deleteBankAccount(
    loggedUser.organization.id,
    req.params.id,
  )
  if (!deletedBankAccount) return res.formatter.notFound('Bank Account not found')
  return res.formatter.ok(deletedBankAccount)
})
