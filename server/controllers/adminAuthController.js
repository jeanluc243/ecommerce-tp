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
    return res.status(500).json({ message: 'L\'authentification administrateur n\'est pas configuree.' })
  }

  if (!phone || !password) {
    return res.status(400).json({ message: 'Le numero de telephone et le mot de passe sont requis.' })
  }

  if (!verifyAdminCredentials(phone, password)) {
    return res.status(401).json({ message: 'Numero de telephone ou mot de passe invalide.' })
  }

  return res.json({
    token: createAdminToken(),
  })
}
