import {
  isAdminAuthConfigured,
  verifyAdminToken,
} from '../lib/adminAuth.js'

export function requireAdminAuth(req, res, next) {
  if (!isAdminAuthConfigured()) {
    return res.status(500).json({ message: 'Admin authentication is not configured.' })
  }

  const authorization = req.headers.authorization ?? ''
  const [scheme, token] = authorization.split(' ')

  if (scheme !== 'Bearer' || !verifyAdminToken(token)) {
    return res.status(401).json({ message: 'Unauthorized admin access.' })
  }

  return next()
}
