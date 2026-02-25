// Cloudflare Pages Function — proxies Anthropic API calls.
// Keeps the API key server-side. Handles the pause_turn loop
// for web search tool use, assembling all content blocks.
//
// Includes per-IP rate limiting and persistent KV response caching
// (survives cold starts, shared across all edge locations).

// ── Rate limiter (in-memory, per-instance) ──────────────────────────
// Edge instances are ephemeral but handle bursts within a single
// instance lifetime. Prevents any single IP from hammering during a session.
const rateLimitMap = new Map()
const RATE_LIMIT = 10       // max calls per window
const RATE_WINDOW_MS = 3600_000  // 1 hour

function checkRateLimit(ip) {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  // Clean stale entries periodically (keep map small)
  if (rateLimitMap.size > 1000) {
    for (const [key, val] of rateLimitMap) {
      if (now - val.windowStart > RATE_WINDOW_MS) rateLimitMap.delete(key)
    }
  }

  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    rateLimitMap.set(ip, { windowStart: now, count: 1 })
    return { allowed: true, remaining: RATE_LIMIT - 1 }
  }

  if (entry.count >= RATE_LIMIT) {
    const retryAfter = Math.ceil((entry.windowStart + RATE_WINDOW_MS - now) / 1000)
    return { allowed: false, remaining: 0, retryAfter }
  }

  entry.count++
  return { allowed: true, remaining: RATE_LIMIT - entry.count }
}

// ── Simple hash for cache keys ──────────────────────────────────────
function simpleHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return hash
}

function getCacheKey(body) {
  const msg = body.messages?.[0]?.content || ''
  const prompt = typeof msg === 'string' ? msg : JSON.stringify(msg)
  return `anthropic:${body.model}:${simpleHash(prompt)}`
}

// ── CORS helper ─────────────────────────────────────────────────────
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

// ── OPTIONS handler (CORS preflight) ────────────────────────────────
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

// ── Main handler ────────────────────────────────────────────────────
export async function onRequestPost(context) {
  const { request: req, env } = context

  const apiKey = env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured on server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    })
  }

  // Rate limit check
  const clientIP = req.headers.get('cf-connecting-ip')
    || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown'
  const rateCheck = checkRateLimit(clientIP)

  if (!rateCheck.allowed) {
    return new Response(JSON.stringify({
      error: `Rate limit exceeded. Please try again in ${rateCheck.retryAfter} seconds. Limit: ${RATE_LIMIT} requests per hour.`,
    }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(rateCheck.retryAfter),
        'X-RateLimit-Remaining': '0',
        ...corsHeaders(),
      },
    })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    })
  }

  if (!body.messages || !body.model) {
    return new Response(JSON.stringify({ error: 'Missing required fields: model, messages' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    })
  }

  // ── Check KV persistent cache ──────────────────────────────────
  const cacheKey = getCacheKey(body)
  if (env.CACHE) {
    try {
      const cached = await env.CACHE.get(cacheKey, 'json')
      if (cached) {
        return new Response(JSON.stringify(cached), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'X-Cache': 'HIT',
            'X-RateLimit-Remaining': String(rateCheck.remaining),
            ...corsHeaders(),
          },
        })
      }
    } catch { /* cache miss, continue */ }
  }

  // ── Request deduplication via KV lock ──────────────────────────
  const lockKey = `lock:${cacheKey}`
  if (env.CACHE) {
    try {
      const existing = await env.CACHE.get(lockKey)
      if (existing) {
        // Another request is already processing this prompt — wait briefly
        await new Promise(r => setTimeout(r, 2000))
        const result = await env.CACHE.get(cacheKey, 'json')
        if (result) {
          return new Response(JSON.stringify(result), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'X-Cache': 'DEDUP',
              'X-RateLimit-Remaining': String(rateCheck.remaining),
              ...corsHeaders(),
            },
          })
        }
        // If still no result, fall through and make the call ourselves
      }
      // Set lock (60s safety TTL)
      await env.CACHE.put(lockKey, '1', { expirationTtl: 60 })
    } catch { /* lock failed, continue anyway */ }
  }

  try {
    // Call the Anthropic API, handling the pause_turn loop for web search
    let messages = [...body.messages]
    let allContent = []
    const maxTurns = 10

    for (let turn = 0; turn < maxTurns; turn++) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: body.model,
          max_tokens: body.max_tokens || 8000,
          tools: body.tools || [],
          messages,
        }),
      })

      if (!response.ok) {
        const errText = await response.text().catch(() => '')
        let errorMessage = `Anthropic API error ${response.status}`
        try {
          const errJson = JSON.parse(errText)
          if (errJson.error?.message) errorMessage = errJson.error.message
        } catch { /* use default */ }

        return new Response(JSON.stringify({ error: errorMessage }), {
          status: response.status,
          headers: { 'Content-Type': 'application/json', ...corsHeaders() },
        })
      }

      const data = await response.json()
      allContent = allContent.concat(data.content || [])

      // If pause_turn, the model needs another turn (web search loop)
      if (data.stop_reason === 'pause_turn') {
        messages = [...messages, { role: 'assistant', content: data.content }]
        continue
      }

      // Done — assemble, cache, and return
      const result = {
        id: data.id,
        type: data.type,
        role: data.role,
        model: data.model,
        content: allContent,
        stop_reason: data.stop_reason,
        usage: data.usage,
      }

      // Store in KV persistent cache (30 min TTL)
      if (env.CACHE) {
        env.CACHE.put(cacheKey, JSON.stringify(result), { expirationTtl: 1800 })
          .catch(() => {}) // fire-and-forget
      }

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Cache': 'MISS',
          'X-RateLimit-Remaining': String(rateCheck.remaining),
          ...corsHeaders(),
        },
      })
    }

    return new Response(JSON.stringify({ error: 'Max API turns exceeded' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    })
  } catch (error) {
    console.error('Anthropic proxy error:', error)
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    })
  }
}
