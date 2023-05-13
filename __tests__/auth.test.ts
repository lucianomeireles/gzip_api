import request from 'supertest'
import { app, mongooseConfig } from '../src/app'
import { validUser } from './mockdatatest'

var token = ''

beforeAll(async () => {
  const response = await request(app).post('/auth/login').send(validUser)
  token = response.body.data.token
})

afterAll(async () => {
  await mongooseConfig.mongoose.connection.close()
})

describe('authRouter', () => {
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
      expect(response.body.error).toBe('e-mail or passaword not valid.')
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
