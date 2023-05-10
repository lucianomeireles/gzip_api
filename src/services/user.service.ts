import User, { IUser } from '../models/user'

export default class UserService {
  public static async createUser(user: IUser): Promise<IUser> {
    return User.create(user)
  }

  public static async getUserById(id: string): Promise<IUser | null> {
    return User.findById(id).exec()
  }

  public static async getUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).exec()
  }

  public static async getUsers(): Promise<IUser[]> {
    return User.find()
  }
}
