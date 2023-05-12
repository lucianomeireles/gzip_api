import { Request, Response } from 'express'
import catchAsync from '../../middlewares/catchAsync'
import { IBook } from '../../models/book.model'
import bookService from '../../services/book.service'
import AppError from '../../utils/appError'

export const getBooks = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const books: IBook[] = await bookService.getBooks()
  return res.formatter.ok(books)
})

export const getBookById = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const book: IBook | null = await bookService.getBookById(req.params.id)
  if (!book) throw new AppError('Book not found', 404)
  return res.formatter.ok(book)
})

export const createBook = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const book = await bookService.createBook({
    ...req.body,
  })

  return res.formatter.created(book)
})

export const updateBook = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const updatedBook: IBook | null = await bookService.updateBook(req.params.id, req.body)
  if (!updatedBook) return res.formatter.notFound('Book not found')
  return res.formatter.ok(updatedBook)
})

export const deleteBook = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const deletedBook: IBook | null = await bookService.deleteBook(req.params.id)
  if (!deletedBook) return res.formatter.notFound('Book not found')
  return res.formatter.ok(deletedBook)
})
