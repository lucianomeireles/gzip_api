import mongoose, { model, Model, Document } from 'mongoose'
import bcryptjs from 'bcryptjs'

export interface IUser {
  name: string
  email: string
  password: string
  createdAt?: Date
  updatedAt?: Date
}

export interface IUserDocument extends IUser, Document {}
export type IUserModel = Model<IUserDocument>

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
  },
  { timestamps: true },
)

// Hash the user's password before saving it to the database
UserSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcryptjs.genSalt(10)
  const hash = await bcryptjs.hash(this.password, salt)
  this.password = hash
  next()
})

export const UserModel = model<IUserDocument>('User', UserSchema)
