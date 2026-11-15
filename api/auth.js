import { jwtVerify } from 'jose'

const invalidTokenCodes = new Set([
  'ERR_JOSE_ALG_NOT_ALLOWED',
  'ERR_JOSE_NOT_SUPPORTED',
  'ERR_JWS_INVALID',
  'ERR_JWS_SIGNATURE_VERIFICATION_FAILED',
  'ERR_JWT_CLAIM_VALIDATION_FAILED',
  'ERR_JWT_EXPIRED',
  'ERR_JWT_INVALID',
  'ERR_JWKS_NO_MATCHING_KEY',
])

export function createTokenVerifier(jwks, issuer) {
  return async (token) => {
    let payload
    try {
      ;({ payload } = await jwtVerify(token, jwks, {
        issuer,
        audience: issuer,
        algorithms: ['EdDSA'],
        requiredClaims: ['sub', 'exp'],
      }))
    } catch (error) {
      if (invalidTokenCodes.has(error.code)) {
        throw Object.assign(new Error('Invalid token'), { code: 'INVALID_TOKEN' })
      }
      throw error
    }
    if (typeof payload.sub !== 'string' || !payload.sub || payload.role !== 'authenticated') {
      throw Object.assign(new Error('Invalid token'), { code: 'INVALID_TOKEN' })
    }
    return payload.sub
  }
}
