import request from 'supertest'
import { app, mongooseConfig } from '../src/app'
import { validUser } from './mockdatatest'

let token = ''
let newBookId = ''

beforeAll(async () => {
  const response = await request(app).post('/auth/login').send(validUser)
  expect(response.statusCode).toBe(200)
  expect(response.body.data.token).toBeDefined()
  token = response.body.data.token
})

afterAll(async () => {
  await mongooseConfig.mongoose.connection.close()
})

describe('Books API', () => {
  describe('POST /books', () => {
    test('should create a new book', async () => {
      const bookData = {
        title: 'Test Book',
        author: 'Test Author',
        description: 'This is a test book',
      }
      const response = await request(app).post('/books').set('Authorization', `Bearer ${token}`).send(bookData)
      expect(response.statusCode).toBe(201)
      expect(response.body.data).toMatchObject(bookData)
      newBookId = response.body.data.id
    })

    test('should return 400 if required fields are missing', async () => {
      const bookData = {
        author: 'Test Author',
      }
      const response = await request(app).post('/books').set('Authorization', `Bearer ${token}`).send(bookData)
      expect(response.statusCode).toBe(400)
    })
  })

  describe('GET /books', () => {
    test('should respond with JSON data of all books and status code 200', async () => {
      const response = await request(app).get('/books').set('Authorization', `Bearer ${token}`)
      expect(response.statusCode).toBe(200)
      expect(response.body.data).toBeInstanceOf(Array)
      expect(response.body.data[0]).toHaveProperty('id')
      expect(response.body.data[0]).toHaveProperty('title')
      expect(response.body.data[0]).toHaveProperty('author')
    })
  })

  describe('GET /books/:id', () => {
    test('should respond with JSON data of a single book and status code 200', async () => {
      const response = await request(app).get(`/books/${newBookId}`).set('Authorization', `Bearer ${token}`)
      expect(response.statusCode).toBe(200)
      expect(response.body.data).toHaveProperty('id')
      expect(response.body.data).toHaveProperty('title')
      expect(response.body.data).toHaveProperty('author')
    })

    test('should return 404 if book is not found', async () => {
      const response = await request(app).get('/books/123456789012345678901234').set('Authorization', `Bearer ${token}`)
      expect(response.statusCode).toBe(404)
    })
  })

  describe('PUT /books/:id', () => {
    test('should update an existing book', async () => {
      const bookData = {
        title: 'Test Book Updated',
        author: 'Test Author Updated',
        description: 'This is a test book updated',
      }
      const response = await request(app)
        .put(`/books/${newBookId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(bookData)
      expect(response.statusCode).toBe(200)
      expect(response.body.data.title).toBe(bookData.title)
      expect(response.body.data.author).toBe(bookData.author)
      expect(response.body.data.description).toBe(bookData.description)
    })

    test('should return 404 if book is not found', async () => {
      const bookData = {
        title: 'Test Book Updated',
        author: 'Test Author Updated',
        description: 'This is a test book updated',
      }
      const response = await request(app)
        .put('/books/645eb57613e8d6a15bef3242')
        .set('Authorization', `Bearer ${token}`)
        .send(bookData)
      expect(response.statusCode).toBe(404)
    })

    test('should return 400 if required fields are missing', async () => {
      const bookData = {
        title: '',
        author: '',
        description: '',
      }
      const response = await request(app)
        .put(`/books/${newBookId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(bookData)
      expect(response.statusCode).toBe(400)
    })
  })

  describe('DELETE /books/:id', () => {
    test('should delete a book by id', async () => {
      const response = await request(app).delete(`/books/${newBookId}`).set('Authorization', `Bearer ${token}`)
      expect(response.statusCode).toBe(200)
      expect(response.body.data).toMatchObject({ id: newBookId })
    })

    test('should return 404 when deleting non-existent book', async () => {
      const response = await request(app).delete(`/books/${newBookId}`).set('Authorization', `Bearer ${token}`)
      expect(response.statusCode).toBe(404)
    })

    test('should return 400 when deleting book with invalid id', async () => {
      const response = await request(app).delete('/books/invalidid').set('Authorization', `Bearer ${token}`)
      expect(response.statusCode).toBe(400)
    })
  })
})
