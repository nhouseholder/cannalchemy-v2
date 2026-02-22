// Netlify edge function — proxies Anthropic API calls.
// Keeps the API key server-side. Handles the pause_turn loop
// for web search tool use, assembling all content blocks.
// Edge functions have a 50ms CPU limit but I/O wait (fetch) is free,
// so long API calls are fine.

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const apiKey = Netlify.env.get('ANTHROPIC_API_KEY')
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured on server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!body.messages || !body.model) {
    return new Response(JSON.stringify({ error: 'Missing required fields: model, messages' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
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
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const data = await response.json()
      allContent = allContent.concat(data.content || [])

      // If pause_turn, the model needs another turn (web search loop)
      if (data.stop_reason === 'pause_turn') {
        messages = [...messages, { role: 'assistant', content: data.content }]
        continue
      }

      // Done — return the assembled response
      return new Response(JSON.stringify({
        id: data.id,
        type: data.type,
        role: data.role,
        model: data.model,
        content: allContent,
        stop_reason: data.stop_reason,
        usage: data.usage,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Max API turns exceeded' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Anthropic proxy error:', error)
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export const config = {
  path: '/api/anthropic',
}
