import mongoose, { Document, Model, Schema } from 'mongoose'
import { IOrganization } from './organization.model'

export interface IBankAccount extends Document {
  organization: IOrganization
  accountNumber: string
  bankName: string
  balance: number
  createdAt?: Date
  updatedAt?: Date
}

export type IBankAccountModel = Model<IBankAccount>
const BankAccountSchema: Schema = new Schema(
  {
    accountNumber: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export const BankAccountModel = mongoose.model<IBankAccount>('BankAccount', BankAccountSchema)
