import request from 'supertest'
import { app, mongooseConfig } from '../src/app'
import { generateOrgData, getToken } from './mockdatatest'
import { IBankAccount } from '../src/models/bankAccount.model'

let token = ''
let organizationId = ''
let bankAccount: Partial<IBankAccount> = {} as IBankAccount

beforeAll(async () => {
  const orgData = generateOrgData()
  const res = await getToken(app, orgData)
  organizationId = res.organizationId
  token = res.token
})

afterAll(async () => {
  if (organizationId) {
    await request(app).delete(`/orgs/${organizationId}`).set('Authorization', `Bearer ${token}`)
  }
  await mongooseConfig.mongoose.connection.close()
})

describe('Bank Account Routes', () => {
  it('POST /bank-accounts should create a new bank account', async () => {
    bankAccount = {
      accountNumber: '123456',
      bankName: 'Bank XYZ',
      balance: 1000,
    }

    const response = await request(app).post('/bank-accounts').set('Authorization', `Bearer ${token}`).send(bankAccount)

    expect(response.statusCode).toBe(201)
    expect(response.body.data.accountNumber).toMatch(bankAccount.accountNumber!)
    expect(response.body.data.bankName).toMatch(bankAccount.bankName!)
    expect(response.body.data.balance).toBe(bankAccount.balance)
    bankAccount = response.body.data
  })

  it('GET /bank-accounts should return all bank accounts', async () => {
    const response = await request(app).get('/bank-accounts').set('Authorization', `Bearer ${token}`)
    expect(response.statusCode).toBe(200)
    expect(response.body.data).toBeDefined()
  })

  it('GET /bank-accounts/:id should return a specific bank account', async () => {
    const response = await request(app).get(`/bank-accounts/${bankAccount.id}`).set('Authorization', `Bearer ${token}`)
    expect(response.statusCode).toBe(200)
    expect(response.body.data.id).toBe(bankAccount.id)
  })

  it('PUT /bank-accounts/:id should update a specific bank account', async () => {
    bankAccount.balance = 2000
    const response = await request(app)
      .put(`/bank-accounts/${bankAccount.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        accountNumber: bankAccount.accountNumber,
        bankName: bankAccount.bankName,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.data.accountNumber).toBe(bankAccount.accountNumber)
    expect(response.body.data.bankName).toBe(bankAccount.bankName)
  })

  it('DELETE /bank-accounts/:id should delete a specific bank account', async () => {
    const response = await request(app)
      .delete(`/bank-accounts/${bankAccount.id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(response.statusCode).toBe(200)
  })
})
