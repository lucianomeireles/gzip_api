import { Schema, model, Document, Model } from 'mongoose'

export interface IOrganization extends Document {
  name: string
  active: boolean
  createdAt?: Date
  updatedAt?: Date
}

export type IOrganizationModel = Model<IOrganization>

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
)

export const OrganizationModel = model<IOrganization>('Organization', OrganizationSchema)