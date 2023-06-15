import express from 'express'
import {
  createBankAccount,
  deleteBankAccount,
  getBankAccountById,
  getBankAccounts,
  updateBankAccount,
} from '../controllers/bankAccount.controller'

const router = express.Router()

router.get('/', getBankAccounts)
router.get('/:id', getBankAccountById)
router.post('/', createBankAccount)
router.put('/:id', updateBankAccount)
router.delete('/:id', deleteBankAccount)

export default router
