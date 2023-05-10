import { Schema, Document, model } from 'mongoose'
import bcryptjs from 'bcryptjs'

export interface IUser {
  name: string
  email: string
  password: string
  createdAt?: Date
  updatedAt?: Date
}

interface IUserExtended extends IUser, Document {}

const UserSchema = new Schema<IUserExtended>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
)

// Hash the user's password before saving it to the database
UserSchema.pre<IUserExtended>('save', async function (next) {
  const user = this
  if (!user.isModified('password')) return next()
  const salt = await bcryptjs.genSalt(10)
  const hash = await bcryptjs.hash(user.password, salt)
  user.password = hash
  next()
})

export default model<IUserExtended>('User', UserSchema)
