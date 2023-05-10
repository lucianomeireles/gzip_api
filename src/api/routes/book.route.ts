import express from 'express'
import { addBook, deleteBook, getBookById, getBooks, updateBook } from '../controllers/book.controller'
import { authenticateJwt } from '../../middlewares/authenticateJwt'

const router = express.Router()

router.get('/', authenticateJwt, getBooks)
router.get('/:id', authenticateJwt, getBookById)
router.post('/', authenticateJwt, addBook)
router.put('/:id', authenticateJwt, updateBook)
router.delete('/:id', authenticateJwt, deleteBook)

export default router
