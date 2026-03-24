import { Router } from 'express'
import {
  createCheckoutOrder,
  getAdminOrders,
  validateAdminOrderOnWhatsApp,
} from '../controllers/orderController.js'
import { requireAdminAuth } from '../middleware/requireAdminAuth.js'

const router = Router()

router.post('/orders', createCheckoutOrder)
router.get('/admin/orders', requireAdminAuth, getAdminOrders)
router.patch('/admin/orders/:id/validate-whatsapp', requireAdminAuth, validateAdminOrderOnWhatsApp)

export default router
