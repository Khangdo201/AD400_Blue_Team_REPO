const fields = {
  companyName: 'company_name',
  jobTitle: 'job_title',
  salary: 'salary',
  signingBonus: 'signing_bonus',
  firstYearEquity: 'first_year_equity',
  ptoDays: 'pto_days',
  sickLeaveDays: 'sick_leave_days',
  employerMatch: 'employer_match',
  workArrangement: 'work_arrangement',
  learningOpportunities: 'learning_opportunities',
}

const selection = `
  id, company_name AS "companyName", job_title AS "jobTitle",
  salary::float8 AS salary, signing_bonus::float8 AS "signingBonus",
  first_year_equity::float8 AS "firstYearEquity", pto_days AS "ptoDays",
  sick_leave_days AS "sickLeaveDays", employer_match::float8 AS "employerMatch",
  work_arrangement AS "workArrangement", learning_opportunities AS "learningOpportunities",
  created_at AS "createdAt", updated_at AS "updatedAt"
`

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const required = ['companyName', 'jobTitle', 'salary']
const money = ['salary', 'signingBonus', 'firstYearEquity', 'employerMatch']
const integer = ['ptoDays', 'sickLeaveDays']

function validate(input, partial) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null
  const entries = Object.entries(input)
  if (!entries.length || entries.some(([key]) => !Object.hasOwn(fields, key))) return null
  if (!partial && required.some((key) => !Object.hasOwn(input, key))) return null
  const result = {}
  for (const [key, value] of entries) {
    if (value === null) {
      if (required.includes(key)) return null
      result[key] = null
    } else if (money.includes(key)) {
      const max = key === 'employerMatch' ? 100 : 9999999999.99
      if (typeof value !== 'number' || !Number.isFinite(value) ||
          value < 0 || value > max || Math.round(value * 100) / 100 !== value ||
          (key === 'salary' && value === 0)) return null
      result[key] = value
    } else if (integer.includes(key)) {
      if (!Number.isInteger(value) || value < 0 || value > 2147483647) return null
      result[key] = value
    } else if (typeof value !== 'string' || value.length > 10000) {
      return null
    } else if (key === 'companyName' || key === 'jobTitle') {
      if (!value.trim()) return null
      result[key] = value.trim()
    } else if (key === 'workArrangement') {
      if (!['Remote', 'Hybrid', 'On-site'].includes(value)) return null
      result[key] = value
    } else {
      result[key] = value
    }
  }
  return result
}

export function createOffersHandler({ query, verifyToken, allowedOrigins }) {
  return async function handle(request) {
    const origin = request.headers.get('origin')
    const headers = { 'Cache-Control': 'no-store', Vary: 'Origin' }
    if (origin && !allowedOrigins.has(origin)) {
      return Response.json({ error: 'Origin not allowed' }, { status: 403, headers })
    }
    if (origin) headers['Access-Control-Allow-Origin'] = origin
    headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
    headers['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, DELETE, OPTIONS'
    const respond = (body, status = 200) => Response.json(body, { status, headers })
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers })

    const authorization = request.headers.get('authorization')
    if (!authorization || !/^Bearer \S+$/i.test(authorization)) {
      return respond({ error: 'Unauthorized' }, 401)
    }
    let userId
    try {
      userId = await verifyToken(authorization.slice(7))
    } catch (error) {
      if (error.code === 'INVALID_TOKEN') return respond({ error: 'Unauthorized' }, 401)
      console.error('Token verification failed', error.code || error.name)
      return respond({ error: 'Authentication unavailable' }, 503)
    }
    if (!userId) return respond({ error: 'Unauthorized' }, 401)

    const url = new URL(request.url)
    const match = /^\/offers(?:\/([^/]+))?\/?$/.exec(url.pathname)
    if (!match) return respond({ error: 'Not found' }, 404)
    const id = match[1]
    if (id && !uuid.test(id)) return respond({ error: 'Invalid offer ID' }, 400)

    try {
      if (request.method === 'GET') {
        if (id) {
          const result = await query(`SELECT ${selection} FROM public.offers WHERE id = $1 AND user_id = $2`, [id, userId])
          return result.rows[0] ? respond(result.rows[0]) : respond({ error: 'Not found' }, 404)
        }
        const limit = url.searchParams.get('limit') ?? '50'
        const offset = url.searchParams.get('offset') ?? '0'
        if (!/^[0-9]+$/.test(limit) || !/^[0-9]+$/.test(offset) ||
            Number(limit) < 1 || Number(limit) > 100 ||
            !Number.isSafeInteger(Number(offset)) || Number(offset) > 2147483647) {
          return respond({ error: 'Invalid pagination' }, 400)
        }
        const result = await query(
          `SELECT ${selection} FROM public.offers WHERE user_id = $1 ORDER BY created_at DESC, id DESC LIMIT $2 OFFSET $3`,
          [userId, Number(limit), Number(offset)],
        )
        return respond(result.rows)
      }

      if ((request.method === 'POST' && !id) || (request.method === 'PATCH' && id)) {
        let body
        try {
          const text = await request.text()
          if (text.length > 32768) return respond({ error: 'Request too large' }, 413)
          body = JSON.parse(text)
        } catch (error) {
          if (!(error instanceof SyntaxError)) throw error
          return respond({ error: 'Invalid JSON' }, 400)
        }
        const input = validate(body, request.method === 'PATCH')
        if (!input) return respond({ error: 'Invalid offer' }, 400)
        const entries = Object.entries(input)
        if (request.method === 'POST') {
          const columns = entries.map(([key]) => fields[key])
          const placeholders = entries.map((_, index) => `$${index + 2}`)
          const result = await query(
            `INSERT INTO public.offers (user_id, ${columns.join(', ')}) VALUES ($1, ${placeholders.join(', ')}) RETURNING ${selection}`,
            [userId, ...entries.map(([, value]) => value)],
          )
          return respond(result.rows[0], 201)
        }
        const assignments = entries.map(([key], index) => `${fields[key]} = $${index + 3}`)
        const result = await query(
          `UPDATE public.offers SET ${assignments.join(', ')} WHERE id = $1 AND user_id = $2 RETURNING ${selection}`,
          [id, userId, ...entries.map(([, value]) => value)],
        )
        return result.rows[0] ? respond(result.rows[0]) : respond({ error: 'Not found' }, 404)
      }

      if (request.method === 'DELETE' && id) {
        const result = await query('DELETE FROM public.offers WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId])
        return result.rows.length ? new Response(null, { status: 204, headers }) : respond({ error: 'Not found' }, 404)
      }
      return respond({ error: 'Method not allowed' }, 405)
    } catch (error) {
      console.error('Offers request failed', error.code || error.name)
      return respond({ error: 'Internal server error' }, 500)
    }
  }
}
