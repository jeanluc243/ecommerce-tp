import { Router } from 'express'
import {
  createAdminBrand,
  deleteAdminBrand,
  getBrands,
  updateAdminBrand,
} from '../controllers/brandController.js'
import { requireAdminAuth } from '../middleware/requireAdminAuth.js'

const router = Router()

router.get('/brands', getBrands)
router.get('/admin/brands', requireAdminAuth, getBrands)
router.post('/admin/brands', requireAdminAuth, createAdminBrand)
router.put('/admin/brands/:id', requireAdminAuth, updateAdminBrand)
router.delete('/admin/brands/:id', requireAdminAuth, deleteAdminBrand)

export default router
