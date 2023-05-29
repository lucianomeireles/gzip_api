import { IUser, IUserDocument, UserModel } from '../models/user.model'
import { random } from 'lodash'

export default class UserService {
  public static async createUser(user: IUser): Promise<IUserDocument> {
    const userEmailExists = await this.getUserByEmail(user.email)
    if (userEmailExists?.id) throw new Error('User with email already exists')

    if (!user.password) user.password = random(100000, 999999).toString()

    return UserModel.create(user)
  }

  public static async getUserById(id: string): Promise<IUserDocument | null> {
    return UserModel.findById(id).populate('organization', 'id name').exec()
  }

  public static async getUserByEmail(email: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ email }).populate('organization', 'id name').exec()
  }

  public static async getUsers(): Promise<IUserDocument[]> {
    return UserModel.find()
  }

  public static async updateUser(id: string, user: IUser): Promise<IUserDocument | null> {
    return UserModel.findByIdAndUpdate(id, user, {
      new: true,
    })
  }

  public static async deleteUser(userId: string): Promise<IUserDocument | null> {
    return UserModel.findByIdAndDelete(userId)
  }
}
