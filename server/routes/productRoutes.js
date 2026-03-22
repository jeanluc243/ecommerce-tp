import { Router } from 'express'
import { requireAdminAuth } from '../middleware/requireAdminAuth.js'
import {
  createAdminProduct,
  deleteAdminProduct,
  getProduct,
  getProducts,
  updateAdminProduct,
} from '../controllers/productController.js'

const router = Router()

router.get('/products', getProducts)
router.get('/products/:id', getProduct)
router.get('/admin/products', requireAdminAuth, getProducts)
router.post('/admin/products', requireAdminAuth, createAdminProduct)
router.put('/admin/products/:id', requireAdminAuth, updateAdminProduct)
router.delete('/admin/products/:id', requireAdminAuth, deleteAdminProduct)

export default router
