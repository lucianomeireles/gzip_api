import request from 'supertest'
import { app, mongooseConfig } from '../src/app'
import { generateOrgData, getToken } from './mockdatatest'
import { IUser } from '../src/models/user.model'

var token = ''
var organizationId = ''
var validUser: IUser = {} as IUser

beforeAll(async () => {
  const orgData = generateOrgData()
  validUser = orgData.user as IUser
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

describe('Auth API', () => {
  describe('POST /auth/login', () => {
    test('returns a 200 response and a token for a valid user', async () => {
      const response = await request(app).post('/auth/login').send({
        email: validUser.email,
        password: validUser.password,
      })

      expect(response.statusCode).toBe(200)
      expect(response.body.data.token).toBeDefined()
    })

    test('returns a 401 response for an invalid password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: validUser.email,
          password: validUser.password + 'wrong',
        })

      expect(response.statusCode).toBe(400)
      expect(response.body.error.message).toBe('e-mail or passaword not valid.')
    })
  })

  describe('GET /auth/loggedUser', () => {
    test('returns a 200 response and the logged in user for an authenticated user', async () => {
      const response = await request(app).get('/auth/loggedUser').set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(200)
      expect(response.body.data.email).toBe(validUser.email)
    })
    test('returns a 401 response for an unauthenticated user', async () => {
      const response = await request(app).get('/auth/loggedUser')

      expect(response.statusCode).toBe(401)
    })
  })

  describe('DELETE /auth/logout', () => {
    it('returns a 200 response and logs out the user', async () => {
      const response = await request(app).delete('/auth/logout').set('Authorization', `Bearer ${token}`)
      expect(response.statusCode).toBe(200)
    })
  })
})
