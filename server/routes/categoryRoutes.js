import { Router } from 'express'
import {
  createAdminCategory,
  deleteAdminCategory,
  getCategories,
  updateAdminCategory,
} from '../controllers/categoryController.js'
import { requireAdminAuth } from '../middleware/requireAdminAuth.js'

const router = Router()

router.get('/categories', getCategories)
router.get('/admin/categories', requireAdminAuth, getCategories)
router.post('/admin/categories', requireAdminAuth, createAdminCategory)
router.put('/admin/categories/:id', requireAdminAuth, updateAdminCategory)
router.delete('/admin/categories/:id', requireAdminAuth, deleteAdminCategory)

export default router
