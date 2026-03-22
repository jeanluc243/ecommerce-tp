import { Router } from 'express'
import { createCheckoutOrder, getAdminOrders } from '../controllers/orderController.js'
import { requireAdminAuth } from '../middleware/requireAdminAuth.js'

const router = Router()

router.post('/orders', createCheckoutOrder)
router.get('/admin/orders', requireAdminAuth, getAdminOrders)

export default router
