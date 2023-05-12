import { IBook, IBookDocument, BookModel } from '../models/book.model'

export default class BookService {
  public static async createBook(book: IBook): Promise<IBookDocument> {
    return BookModel.create(book)
  }

  public static async getBookById(id: string): Promise<IBookDocument | null> {
    return BookModel.findById(id).exec()
  }

  public static async getBooks(): Promise<IBookDocument[]> {
    return BookModel.find()
  }

  public static async updateBook(id: string, book: IBook): Promise<IBookDocument | null> {
    return BookModel.findByIdAndUpdate(id, book, {
      new: true,
    })
  }

  public static async deleteBook(bookId: string): Promise<IBookDocument | null> {
    return BookModel.findByIdAndDelete(bookId)
  }
}
