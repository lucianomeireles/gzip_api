import { random } from 'lodash'
import request from 'supertest'
import { app, mongooseConfig } from '../src/app'
import { IUser } from '../src/models/user.model'
import { generateOrgData, getToken } from './mockdatatest'

let token = ''
let organizationId = ''
let user: Partial<IUser> = {} as IUser

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

describe('User API', () => {
  it('should get all users', async () => {
    const response = await request(app).get('/users').set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    // Add assertions based on your expected response
  })

  it('should create a new user', async () => {
    const randomId = random(1000, 9999999)
    const newUser = {
      name: `UserName ${randomId}`,
      email: `email@org${randomId}.com`,
      password: `password${randomId}`,
    }

    const response = await request(app).post('/users').set('Authorization', `Bearer ${token}`).send(newUser)

    expect(response.statusCode).toBe(201)
    user = response.body.data
  })

  it('should get a specific user', async () => {
    const response = await request(app).get(`/users/${user.id}`).set('Authorization', `Bearer ${token}`)
    expect(response.statusCode).toBe(200)
  })

  it('should update a user', async () => {
    const updatedUser = {
      name: 'New User',
      email: 'newuser@example.com',
      password: 'newpassword',
    }
    const response = await request(app)
      .put(`/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedUser)

    expect(response.statusCode).toBe(200)
    // Add assertions based on your expected response
  })

  it('should delete a user', async () => {
    const response = await request(app).delete(`/users/${user.id}`).set('Authorization', `Bearer ${token}`)
    expect(response.statusCode).toBe(200)
    // Add assertions based on your expected response
  })
})
