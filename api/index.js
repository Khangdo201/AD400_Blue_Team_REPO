import { attachDatabasePool } from '@neon/functions'
import { createRemoteJWKSet } from 'jose'
import pg from 'pg'
import { createTokenVerifier } from './auth.js'
import { createOffersHandler } from './offers.js'

const { DATABASE_URL, NEON_AUTH_BASE_URL, NEON_AUTH_JWKS_URL, ALLOWED_ORIGINS } = process.env
if (!DATABASE_URL || !NEON_AUTH_BASE_URL || !NEON_AUTH_JWKS_URL || !ALLOWED_ORIGINS) {
  throw new Error('DATABASE_URL, NEON_AUTH_BASE_URL, NEON_AUTH_JWKS_URL and ALLOWED_ORIGINS are required')
}

const issuer = new URL(NEON_AUTH_BASE_URL).origin
const jwks = createRemoteJWKSet(new URL(NEON_AUTH_JWKS_URL))
const pool = new pg.Pool({ connectionString: DATABASE_URL, max: 5 })
attachDatabasePool(pool)

const handle = createOffersHandler({
  query: (text, values) => pool.query(text, values),
  verifyToken: createTokenVerifier(jwks, issuer),
  allowedOrigins: new Set(ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)),
})

export default { fetch: handle }
