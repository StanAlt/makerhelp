import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const MAIKA_MODEL = 'claude-sonnet-4-20250514'

const SYSTEM_PROMPT = `You are Maika, the AI settings expert for MakerHelp. You have deep knowledge of laser engraving and cutting settings for diode, CO2, fiber, and galvo lasers.

You have access to the MakerHelp settings database. When answering settings questions, always ground your answer in the actual database entries provided in context. If the database has a relevant entry, cite it specifically (machine, material, power, speed, passes). If no database entry matches, say so honestly and give your best estimate based on general laser knowledge, clearly marking it as an estimate.

Be direct. Give the numbers first, explain second. A maker asking about settings wants: power%, speed, passes — not a paragraph of caveats.

If you're uncertain, say so. Never fabricate settings that could damage someone's machine or material.

When relevant, suggest the user submit their own results to help the community.`

// Simple in-memory rate limiting
const rateLimit = new Map<string, number[]>()
const RATE_LIMIT_WINDOW = 60_000 // 1 minute
const RATE_LIMIT_MAX = 10

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const requests = rateLimit.get(ip) ?? []
  const recent = requests.filter((t) => now - t < RATE_LIMIT_WINDOW)
  rateLimit.set(ip, recent)
  if (recent.length >= RATE_LIMIT_MAX) return true
  recent.push(now)
  rateLimit.set(ip, recent)
  return false
}

function extractKeywords(messages: Array<{ role: string; content: string }>): string[] {
  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')?.content ?? ''
  // Extract meaningful keywords (machine names, materials, operations)
  const words = lastUserMsg
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2)
  return words
}

export async function POST(request: Request) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'Maika is not configured. Set ANTHROPIC_API_KEY.' },
      { status: 503 }
    )
  }

  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Rate limited. Try again in a minute.' }, { status: 429 })
  }

  const { messages } = await request.json()

  if (!messages?.length) {
    return NextResponse.json({ error: 'No messages provided' }, { status: 400 })
  }

  // Query settings database for relevant entries
  const supabase = createClient()
  const keywords = extractKeywords(messages)

  let settingsContext = 'No matching entries found in the database.'

  if (keywords.length > 0) {
    // Build OR filter matching keywords against machine brand/model and material name
    const { data: settings } = await supabase
      .from('settings')
      .select('*, machines(*), materials(*)')
      .eq('approved', true)
      .limit(20)

    if (settings?.length) {
      // Filter settings that match any keyword
      const matched = settings.filter((s) => {
        const haystack = [
          s.machines?.brand,
          s.machines?.model,
          s.materials?.name,
          s.materials?.category,
          s.operation,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return keywords.some((kw) => haystack.includes(kw))
      })

      const toShow = matched.length > 0 ? matched.slice(0, 10) : settings.slice(0, 5)

      settingsContext = toShow
        .map(
          (s) =>
            `Machine: ${s.machines?.brand} ${s.machines?.model} (${s.machines?.type}, ${s.machines?.wattage})\n` +
            `Material: ${s.materials?.name} (${s.materials?.category})${s.thickness_mm ? `, ${s.thickness_mm}mm` : ''}\n` +
            `Operation: ${s.operation}\n` +
            `Settings: Power ${s.power_pct}%, Speed ${s.speed_mmsec}mm/s, ${s.passes} pass(es)\n` +
            (s.lpi ? `LPI: ${s.lpi}\n` : '') +
            (s.air_assist ? 'Air assist: Yes\n' : '') +
            (s.focus_notes ? `Focus: ${s.focus_notes}\n` : '') +
            (s.result_notes ? `Result: ${s.result_notes}\n` : '') +
            `Source: ${s.source_type}${s.source_url ? ` (${s.source_url})` : ''}`
        )
        .join('\n\n---\n\n')
    }
  }

  const systemPrompt = `${SYSTEM_PROMPT}\n\nContext from the settings database:\n${settingsContext}`

  // Call Anthropic API with streaming
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MAIKA_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.slice(-10), // Keep last 10 messages for context
      stream: true,
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    console.error('Anthropic API error:', errText)
    return NextResponse.json({ error: 'Maika is temporarily unavailable' }, { status: 502 })
  }

  // Stream the response back
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body?.getReader()
      if (!reader) {
        controller.close()
        return
      }

      const decoder = new TextDecoder()
      let buffer = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue
              try {
                const parsed = JSON.parse(data)
                if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                  controller.enqueue(encoder.encode(parsed.delta.text))
                }
              } catch {
                // Skip unparseable lines
              }
            }
          }
        }
      } catch (err) {
        console.error('Stream error:', err)
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  })
}
