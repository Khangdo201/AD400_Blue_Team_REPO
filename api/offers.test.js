import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT } from 'jose'
import { createTokenVerifier } from './auth.js'
import { createOffersHandler } from './offers.js'

const issuer = 'https://auth.example.com'
const id = 'a4d074b3-2b64-4b79-9f4f-0df96f98634a'

test('JWT verification rejects wrong issuer, audience, role, and expired tokens', async () => {
  const { publicKey, privateKey } = await generateKeyPair('EdDSA')
  const jwk = { ...await exportJWK(publicKey), kid: 'test' }
  const verify = createTokenVerifier(createLocalJWKSet({ keys: [jwk] }), issuer)
  const token = (claims = {}, exp = '15m') => new SignJWT({ role: 'authenticated', ...claims })
    .setProtectedHeader({ alg: 'EdDSA', kid: 'test' })
    .setIssuer(claims.iss ?? issuer).setAudience(claims.aud ?? issuer)
    .setSubject('user-a').setExpirationTime(exp)
    .sign(privateKey)
  assert.equal(await verify(await token()), 'user-a')
  for (const invalid of [
    await token({ role: 'anonymous' }),
    await token({ iss: 'https://other.example.com' }),
    await token({ aud: 'https://other.example.com' }),
    await token({}, '1s ago'),
  ]) {
    await assert.rejects(verify(invalid), { code: 'INVALID_TOKEN' })
  }
})

test('CRUD scopes every operation to the verified user and validates input', async () => {
  const calls = []
  const query = async (sql, values) => {
    calls.push({ sql, values })
    const owner = sql.startsWith('INSERT') ? values[0] : sql.includes('WHERE id') ? values[1] : values[0]
    return { rows: owner === 'user-a' ? [{ id, companyName: 'Example' }] : [] }
  }
  const handle = createOffersHandler({
    query,
    verifyToken: async (token) => token,
    allowedOrigins: new Set(['http://localhost:5173']),
  })
  const request = (path, method, user, body) => handle(new Request(`https://api.example.com${path}`, {
    method,
    headers: { authorization: `Bearer ${user}`, 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  }))

  assert.equal((await request('/offers', 'POST', 'user-a', { companyName: 'Example', jobTitle: 'Engineer', salary: 120000 })).status, 201)
  assert.equal(calls.at(-1).values[0], 'user-a')
  assert.equal((await request('/offers?limit=10&offset=2', 'GET', 'user-a')).status, 200)
  assert.deepEqual(calls.at(-1).values, ['user-a', 10, 2])
  assert.equal((await request(`/offers/${id}`, 'GET', 'user-b')).status, 404)
  assert.deepEqual(calls.at(-1).values, [id, 'user-b'])
  assert.equal((await request(`/offers/${id}`, 'PATCH', 'user-b', { salary: 100 })).status, 404)
  assert.deepEqual(calls.at(-1).values, [id, 'user-b', 100])
  assert.equal((await request(`/offers/${id}`, 'DELETE', 'user-b')).status, 404)
  assert.deepEqual(calls.at(-1).values, [id, 'user-b'])
  assert.equal((await request('/offers?limit=101', 'GET', 'user-a')).status, 400)
  assert.equal((await request('/offers', 'POST', 'user-a', { companyName: 'Example', jobTitle: 'Engineer', salary: 10, user_id: 'user-b' })).status, 400)
  assert.equal((await request(`/offers/${id}`, 'PATCH', 'user-a', { salary: -1 })).status, 400)
  assert.equal((await request(`/offers/${id}`, 'DELETE', 'user-a')).status, 204)
})

test('rejects unauthenticated and unapproved browser requests', async () => {
  const handle = createOffersHandler({
    query: () => { throw new Error('must not query') },
    verifyToken: () => { throw Object.assign(new Error(), { code: 'INVALID_TOKEN' }) },
    allowedOrigins: new Set(['http://localhost:5173']),
  })
  assert.equal((await handle(new Request('https://api.example.com/offers'))).status, 401)
  assert.equal((await handle(new Request('https://api.example.com/offers', {
    headers: { authorization: 'Bearer invalid' },
  }))).status, 401)
  assert.equal((await handle(new Request('https://api.example.com/offers', {
    method: 'OPTIONS', headers: { origin: 'https://untrusted.example' },
  }))).status, 403)
  assert.equal((await handle(new Request('https://api.example.com/offers', {
    method: 'OPTIONS', headers: { origin: 'http://localhost:5173' },
  }))).status, 204)
})
