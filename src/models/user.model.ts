import mongoose, { Document, Model, Schema } from 'mongoose'
import bcryptjs from 'bcryptjs'
import { IOrganization } from './organization.model'

export interface IUser extends Document {
  organization: IOrganization
  name: string
  email: string
  password: string
  createdAt?: Date
  updatedAt?: Date
}

export type IUserModel = Model<IUser>
const UserSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

// Hash the user's password before saving it to the database
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcryptjs.genSalt(10)
  const hash = await bcryptjs.hash(this.password, salt)
  this.password = hash
  next()
})

export const UserModel = mongoose.model<IUser>('User', UserSchema)
