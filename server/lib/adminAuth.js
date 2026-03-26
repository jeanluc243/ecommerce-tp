import { Buffer } from 'node:buffer'
import crypto from 'node:crypto'
import process from 'node:process'

const DEFAULT_TOKEN_TTL_MS = 1000 * 60 * 60 * 12

function getAdminConfig() {
  return {
    phone: process.env.ADMIN_PHONE ?? '',
    password: process.env.ADMIN_PASSWORD ?? '',
    secret: process.env.ADMIN_TOKEN_SECRET ?? '',
  }
}

export function getMissingAdminAuthEnvVars() {
  const config = getAdminConfig()
  const missingVars = []

  if (!config.phone) {
    missingVars.push('ADMIN_PHONE')
  }

  if (!config.password) {
    missingVars.push('ADMIN_PASSWORD')
  }

  if (!config.secret) {
    missingVars.push('ADMIN_TOKEN_SECRET')
  }

  return missingVars
}

function encodeTokenPayload(payload) {
  return Buffer.from(JSON.stringify(payload)).toString('base64url')
}

function decodeTokenPayload(token) {
  return JSON.parse(Buffer.from(token, 'base64url').toString('utf8'))
}

function signPayload(encodedPayload, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(encodedPayload)
    .digest('base64url')
}

export function isAdminAuthConfigured() {
  return getMissingAdminAuthEnvVars().length === 0
}

export function verifyAdminCredentials(phone, password) {
  const config = getAdminConfig()
  return phone === config.phone && password === config.password
}

export function createAdminToken() {
  const { secret } = getAdminConfig()
  const payload = encodeTokenPayload({
    role: 'admin',
    exp: Date.now() + DEFAULT_TOKEN_TTL_MS,
  })
  const signature = signPayload(payload, secret)
  return `${payload}.${signature}`
}

export function verifyAdminToken(token) {
  const { secret } = getAdminConfig()

  if (!token || !secret) {
    return false
  }

  const [payload, signature] = token.split('.')

  if (!payload || !signature) {
    return false
  }

  const expectedSignature = signPayload(payload, secret)

  if (signature.length !== expectedSignature.length) {
    return false
  }

  const signaturesMatch = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  )

  if (!signaturesMatch) {
    return false
  }

  const decodedPayload = decodeTokenPayload(payload)
  return decodedPayload.role === 'admin' && decodedPayload.exp > Date.now()
}
