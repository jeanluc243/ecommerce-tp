import {
  createAdminToken,
  isAdminAuthConfigured,
  verifyAdminCredentials,
} from '../lib/adminAuth.js'

function sanitizeCredentials(payload) {
  return {
    phone: payload.phone?.trim() ?? '',
    password: payload.password ?? '',
  }
}

export async function loginAdmin(req, res) {
  const { phone, password } = sanitizeCredentials(req.body)

  if (!isAdminAuthConfigured()) {
    return res.status(500).json({ message: 'Admin authentication is not configured.' })
  }

  if (!phone || !password) {
    return res.status(400).json({ message: 'Phone number and password are required.' })
  }

  if (!verifyAdminCredentials(phone, password)) {
    return res.status(401).json({ message: 'Invalid phone number or password.' })
  }

  return res.json({
    token: createAdminToken(),
  })
}
