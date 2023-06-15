import request from 'supertest'
import { app, mongooseConfig } from '../src/app'
import { generateOrgData, getToken } from './mockdatatest'

let token = ''
let organizationId = ''

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

describe('Organizations API', () => {
  describe('POST /orgs', () => {
    test('should return 400 if required fields are missing', async () => {
      const orgData = {}
      const response = await request(app).post('/orgs').send(orgData)
      expect(response.statusCode).toBe(400)
    })
  })

  describe('POST /orgs', () => {
    test('should create a new org', async () => {
      const orgData = generateOrgData()
      const response = await request(app).post('/orgs').send(orgData)
      expect(response.statusCode).toBe(201)
      expect(response.body.data.user.organization.name).toMatch(orgData.org.name)
      expect(response.body.data.user.name).toMatch(orgData.user.name)
      organizationId = response.body.data.user.organization.id
      token = response.body.data.token
    })
  })

  describe('GET /orgs/:id', () => {
    test('should respond with JSON data of a single organization and status code 200', async () => {
      const response = await request(app).get(`/orgs/${organizationId}`).set('Authorization', `Bearer ${token}`)
      expect(response.statusCode).toBe(200)
      expect(response.body.data).toHaveProperty('id')
      expect(response.body.data).toHaveProperty('name')
    })

    test('should return 404 if organization is not found', async () => {
      const response = await request(app).get('/orgs/646285e080c2c4c9d6f94442').set('Authorization', `Bearer ${token}`)
      expect(response.statusCode).toBe(404)
    })
  })

  describe('PUT /orgs/:id', () => {
    test('should update an existing organization', async () => {
      const orgData = {
        name: 'Test Organization Updated',
      }
      const response = await request(app)
        .put(`/orgs/${organizationId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(orgData)
      expect(response.statusCode).toBe(200)
      expect(response.body.data.name).toBe(orgData.name)
    })

    test('should return 404 if organization is not found', async () => {
      const organizationData = {
        name: 'Test Organization Updated',
      }
      const response = await request(app)
        .put('/orgs/646285e080c2c4c9d6f94442')
        .set('Authorization', `Bearer ${token}`)
        .send(organizationData)
      expect(response.statusCode).toBe(404)
    })

    test('should return 400 if required fields are missing', async () => {
      const response = await request(app).put(`/orgs/${organizationId}`).set('Authorization', `Bearer ${token}`).send({
        name: '',
      })
      expect(response.statusCode).toBe(400)
    })
  })

  describe('DELETE /orgs/:id', () => {
    test('should delete a organization by id', async () => {
      const response = await request(app).delete(`/orgs/${organizationId}`).set('Authorization', `Bearer ${token}`)
      expect(response.statusCode).toBe(200)
      expect(response.body.data).toMatchObject({ id: organizationId })
    })

    test('should return 404 when deleting non-existent organization', async () => {
      const response = await request(app).delete(`/orgs/${organizationId}`).set('Authorization', `Bearer ${token}`)
      expect(response.statusCode).toBe(404)
    })

    test('should return 400 when deleting organization with invalid id', async () => {
      const response = await request(app).delete('/orgs/invalidid').set('Authorization', `Bearer ${token}`)
      expect(response.statusCode).toBe(400)
    })
  })
})
