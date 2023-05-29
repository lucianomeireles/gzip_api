import { Schema, model, Document, Model } from 'mongoose'

export interface IOrganization {
  name: string
  active: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface IOrganizationDocument extends IOrganization, Document {}
export type IOrganizationModel = Model<IOrganizationDocument>

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