/**
 * Cloudflare Pages Function — Regional dispensary cache using Cloudflare KV.
 *
 * GET  /api/dispensary-cache?action=check&region=902&strains=Blue+Dream,OG+Kush
 *   → returns cached dispensaries if fresh, else { cached: false }
 *
 * POST /api/dispensary-cache?action=store
 *   → stores new dispensary data for a region
 *
 * Uses Cloudflare KV with native TTL support (24h expiration).
 * Shared across all users — one user's search populates data for
 * ALL users in that zip code area.
 */

const TTL_SECONDS = 24 * 60 * 60 // 24 hours

// ── GET + POST dispatcher ────────────────────────────────────────────
export async function onRequest(context) {
  const { request: req, env } = context
  const url = new URL(req.url)
  const action = url.searchParams.get('action')

  if (!action || !['check', 'store'].includes(action)) {
    return jsonResponse({ error: 'Invalid action. Use ?action=check or ?action=store' }, 400)
  }

  if (!env.CACHE) {
    return jsonResponse({ error: 'KV cache not configured' }, 500)
  }

  try {
    if (action === 'check') {
      return await handleCheck(url, env)
    } else {
      if (req.method !== 'POST') {
        return jsonResponse({ error: 'POST required for store action' }, 405)
      }
      return await handleStore(req, env)
    }
  } catch (err) {
    console.error('Dispensary cache error:', err)
    return jsonResponse({ error: 'Cache error', message: err.message }, 500)
  }
}

/**
 * Check if there's a fresh cache entry for a region.
 * KV handles TTL natively — if the key exists, it's fresh.
 */
async function handleCheck(url, env) {
  const region = url.searchParams.get('region')
  if (!region) {
    return jsonResponse({ error: 'Missing region parameter' }, 400)
  }

  const key = `region:${region}`
  const entry = await env.CACHE.get(key, 'json')

  if (!entry) {
    return jsonResponse({ cached: false })
  }

  // Cache hit — increment hit count (fire-and-forget)
  const updated = { ...entry, hit_count: (entry.hit_count || 1) + 1 }
  const age = Date.now() - (entry.updated_at || 0)
  env.CACHE.put(key, JSON.stringify(updated), { expirationTtl: TTL_SECONDS }).catch(() => {})

  return jsonResponse({
    cached: true,
    dispensaries: entry.dispensaries,
    strain_names: entry.strain_names,
    region_key: region,
    hit_count: updated.hit_count,
    age_hours: Math.round(age / (60 * 60 * 1000) * 10) / 10,
  })
}

/**
 * Store dispensary data for a region.
 * Body: { region_key, dispensaries, strain_names, location_query }
 */
async function handleStore(req, env) {
  let body
  try {
    body = await req.json()
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400)
  }

  const { region_key, dispensaries, strain_names, location_query } = body

  if (!region_key || !dispensaries) {
    return jsonResponse({ error: 'Missing required fields: region_key, dispensaries' }, 400)
  }

  const key = `region:${region_key}`

  // Check if there's an existing entry to preserve hit_count
  const existing = await env.CACHE.get(key, 'json').catch(() => null)
  const hit_count = existing ? (existing.hit_count || 1) : 1

  const entry = {
    region_key,
    dispensaries,
    strain_names: strain_names || [],
    location_query: location_query || '',
    created_at: existing?.created_at || Date.now(),
    updated_at: Date.now(),
    hit_count,
  }

  await env.CACHE.put(key, JSON.stringify(entry), { expirationTtl: TTL_SECONDS })

  return jsonResponse({ stored: true, region_key, hit_count })
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
