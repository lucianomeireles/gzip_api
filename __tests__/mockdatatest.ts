import { random } from 'lodash'
import request from 'supertest'

const validUser = {
  email: 'contato@lucianomeireles.io',
  password: 'password123',
}

const getToken = async (app: any, orgData: any) => {
  const response = await request(app).post('/orgs').send(orgData)
  return {
    token: response.body.data.token,
    organizationId: response.body.data.user.organization.id,
  }
}

const generateOrgData = () => {
  const randomId = random(1000, 9999999)
  return {
    org: {
      name: `My Organization ${randomId}`,
    },
    user: {
      name: `UserName ${randomId}`,
      email: `email@org${randomId}.com`,
      password: `password${randomId}`,
    },
  }
}

export { getToken, generateOrgData, validUser }
