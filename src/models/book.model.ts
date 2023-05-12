import mongoose, { model, Model } from 'mongoose'

export interface IBook {
  title: string
  author: string
  description: string
  createdAt?: Date
  updatedAt?: Date
}

export interface IBookDocument extends IBook, Document {}
export type IBookModel = Model<IBookDocument>

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    dateOfJoining: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true },
)

export const BookModel = model<IBookDocument>('Book', BookSchema)
