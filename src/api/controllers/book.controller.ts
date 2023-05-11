import { NextFunction, Request, Response } from "express";
import Book, { IBook } from "../../models/book.modal";
import catchAsync from "../../middlewares/catchAsync";
import AppError from "../../utils/appError";

export const getBooks = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const books: IBook[] = []; //await Book.find()
    return res.formatter.ok(books);
  }
);

export const getBookById = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const book: IBook | null = await Book.findById(req.params.id);
    if (!book) throw new AppError("Book not found", 404);
    return res.formatter.ok(book);
  }
);

export const addBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const book: IBook = new Book(req.body);
    await book.save();
    return res.formatter.created(book);
  }
);

export const updateBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const updatedBook: IBook | null = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedBook) return res.formatter.notFound("Book not found");
    return res.formatter.ok(updatedBook);
  }
);

export const deleteBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const deletedBook: IBook | null = await Book.findByIdAndDelete(
      req.params.id
    );
    if (!deletedBook) return res.formatter.notFound("Book not found");
    return res.formatter.ok(deletedBook);
  }
);
