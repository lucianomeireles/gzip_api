import { IOrganization, IOrganizationDocument, OrganizationModel } from '../models/organization.model'
import { IUser, IUserDocument, UserModel } from '../models/user.model'
import userService from './user.service'

interface ICreateOrganizationResponse {
  org: IOrganizationDocument
  user: IUserDocument
}

export default class OrganizationService {
  public static async createOrganization(
    organization: IOrganization,
    user: IUser,
  ): Promise<ICreateOrganizationResponse> {
    const organizationEmailExists = await this.getOrganizationByName(organization.name)
    if (organizationEmailExists?.id) throw new Error('Organization with name already exists')

    const newOrg = await OrganizationModel.create(organization)
    user.organization = newOrg
    const newUser = await userService.createUser(user)
    return { org: newOrg, user: newUser }
  }

  public static async getOrganizationById(id: string): Promise<IOrganizationDocument | null> {
    return OrganizationModel.findById(id).exec()
  }

  public static async getOrganizationByName(name: string): Promise<IOrganizationDocument | null> {
    return OrganizationModel.findOne({ name }).exec()
  }

  public static async updateOrganization(
    id: string,
    organization: IOrganization,
  ): Promise<IOrganizationDocument | null> {
    return OrganizationModel.findByIdAndUpdate(id, organization, {
      new: true,
    })
  }

  public static async deleteOrganization(organizationId: string): Promise<IOrganizationDocument | null> {
    await UserModel.deleteMany({ organizationId: organizationId })
    return OrganizationModel.findByIdAndDelete(organizationId)
  }
}
