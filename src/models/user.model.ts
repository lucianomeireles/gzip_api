import { Schema, model, Model, Document } from 'mongoose'
import bcryptjs from 'bcryptjs'
import { IOrganization } from './organization.model'

export interface IUser {
  name: string
  email: string
  password: string
  organization: IOrganization
  createdAt?: Date
  updatedAt?: Date
}

export interface IUserDocument extends IUser, Document {}
export type IUserModel = Model<IUserDocument>

const UserSchema = new Schema(
  {
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
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
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
