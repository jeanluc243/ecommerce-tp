import {
  getMissingAdminAuthEnvVars,
  isAdminAuthConfigured,
  verifyAdminToken,
} from '../lib/adminAuth.js'

export function requireAdminAuth(req, res, next) {
  if (!isAdminAuthConfigured()) {
    const missingVars = getMissingAdminAuthEnvVars()
    return res.status(500).json({
      message: `L'authentification administrateur n'est pas configuree. Variables manquantes: ${missingVars.join(', ')}`,
    })
  }

  const authorization = req.headers.authorization ?? ''
  const [scheme, token] = authorization.split(' ')

  if (scheme !== 'Bearer' || !verifyAdminToken(token)) {
    return res.status(401).json({ message: 'Acces administrateur non autorise.' })
  }

  return next()
}
