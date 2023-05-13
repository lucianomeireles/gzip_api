import { Request, Response } from 'express'
import catchAsync from '../../middlewares/catchAsync'
import { IBook } from '../../models/book.model'
import bookService from '../../services/book.service'
import Joi from 'joi'
import AppError from '../../utils/appError'

const bookJoiSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  description: Joi.string(),
})

export const getBooks = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const books: IBook[] = await bookService.getBooks()
  return res.formatter.ok(books)
})

export const getBookById = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const book: IBook | null = await bookService.getBookById(req.params.id)
  if (!book) res.formatter.notFound('Book not found')
  return res.formatter.ok(book)
})

export const createBook = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { error } = bookJoiSchema.validate(req.body)
  if (error) throw new AppError(error.details[0].message, 400)

  const book = await bookService.createBook({
    ...req.body,
  })

  return res.formatter.created(book)
})

export const updateBook = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { error } = bookJoiSchema.validate(req.body)
  if (error) throw new AppError(error.details[0].message, 400)

  const updatedBook: IBook | null = await bookService.updateBook(req.params.id, req.body)
  if (!updatedBook) return res.formatter.notFound('Book not found')
  return res.formatter.ok(updatedBook)
})

export const deleteBook = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const deletedBook: IBook | null = await bookService.deleteBook(req.params.id)
  if (!deletedBook) return res.formatter.notFound('Book not found')
  return res.formatter.ok(deletedBook)
})
