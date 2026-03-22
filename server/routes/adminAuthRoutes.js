import { Router } from 'express'
import { loginAdmin } from '../controllers/adminAuthController.js'

const router = Router()

router.post('/admin/auth/login', loginAdmin)

export default router
