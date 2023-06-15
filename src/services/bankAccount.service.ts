import { IBankAccount, BankAccountModel } from '../models/bankAccount.model'

export default class BankAccountService {
  public static async createBankAccount(accountData: IBankAccount): Promise<IBankAccount> {
    return BankAccountModel.create(accountData)
  }

  public static async getBankAccountById(orgId: string, bankAccountId: string): Promise<IBankAccount | null> {
    return BankAccountModel.findOne({ organization: orgId, _id: bankAccountId })
  }

  public static async getBankAccounts(orgId: string): Promise<IBankAccount[]> {
    return BankAccountModel.find({ organization: orgId })
  }

  public static async updateBankAccount(
    orgId: string,
    id: string,
    accountData: Partial<IBankAccount>,
  ): Promise<IBankAccount | null> {
    return BankAccountModel.findByIdAndUpdate({ organization: orgId, _id: id }, accountData, { new: true })
  }

  public static async deleteBankAccount(orgId: string, id: string): Promise<IBankAccount | null> {
    return BankAccountModel.findByIdAndDelete({ organization: orgId, _id: id })
  }
}
