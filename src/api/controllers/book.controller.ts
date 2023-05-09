import { NextFunction, Request, Response } from "express";
import Book, { IBook } from "../../models/book";
import catchAsync from "../../middlewares/catchAsync";
import AppError from "../../utils/appError";

export const getBooks = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const books: IBook[] = await Book.find();
    res.locals.data = books;
    //throw new AppError("Error getting books", 404);

    return next(); // pass control to the success middleware
  }
);

export const getBookById = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const book: IBook | null = await Book.findById(req.params.id);
    if (!book) throw new AppError("Book not found", 404);
    res.locals.data = book;
    return next();
  }
);

export const addBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const book: IBook = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding book" });
  }
};

export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updatedBook: IBook | null = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedBook) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    res.status(200).json(updatedBook);
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deletedBook: IBook | null = await Book.findByIdAndDelete(
      req.params.id
    );
    if (!deletedBook) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    res.status(200).json(deletedBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting book" });
  }
};
