import { Schema, model, Document } from 'mongoose'

export interface IBook extends Document {
  title: string
  author: string
  description: string
  createdAt?: Date
  updatedAt?: Date
}

const BookSchema = new Schema<IBook>(
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
  },
  { timestamps: true },
)

const Book = model<IBook>('Book', BookSchema)

export default Book
