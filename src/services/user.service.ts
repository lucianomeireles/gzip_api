import { IUser, UserModel } from '../models/user.model'
import { random } from 'lodash'

export default class UserService {
  public static async createUser(user: IUser): Promise<IUser> {
    const userEmailExists = await this.getUserByEmail(user.email)
    if (userEmailExists?.id) throw new Error('User with email already exists')
    if (!user.password) user.password = random(100000, 999999).toString()

    return UserModel.create(user)
  }

  public static async getUserById(id: string): Promise<IUser | null> {
    return UserModel.findById(id).populate('organization', 'id name')
  }

  public static async getUserByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email: email }).populate('organization', 'id name')
  }

  public static async getUsers(orgId: string): Promise<IUser[]> {
    return UserModel.find({ organization: orgId })
  }

  public static async updateUser(orgId: string, id: string, user: IUser): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate({ organization: orgId, _id: id }, user, {
      new: true,
    })
  }

  public static async deleteUser(orgId: string, id: string): Promise<IUser | null> {
    return UserModel.findByIdAndDelete({ organization: orgId, _id: id })
  }
}
