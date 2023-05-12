import express from 'express'
import { createBook, deleteBook, getBookById, getBooks, updateBook } from '../controllers/book.controller'

const router = express.Router()

router.get('/', getBooks)
router.get('/:id', getBookById)
router.post('/', createBook)
router.put('/:id', updateBook)
router.delete('/:id', deleteBook)

export default router
