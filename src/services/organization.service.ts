import { IOrganization, OrganizationModel } from '../models/organization.model'
import { IUser, UserModel } from '../models/user.model'
import userService from './user.service'

interface ICreateOrganizationResponse {
  org: IOrganization
  user: IUser
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

  public static async getOrganizationById(id: string): Promise<IOrganization | null> {
    return OrganizationModel.findById(id).exec()
  }

  public static async getOrganizationByName(name: string): Promise<IOrganization | null> {
    return OrganizationModel.findOne({ name }).exec()
  }

  public static async updateOrganization(id: string, organization: IOrganization): Promise<IOrganization | null> {
    return OrganizationModel.findByIdAndUpdate(id, organization, {
      new: true,
    })
  }

  public static async deleteOrganization(organizationId: string): Promise<IOrganization | null> {
    await UserModel.deleteMany({ organizationId: organizationId })
    return OrganizationModel.findByIdAndDelete(organizationId)
  }
}
