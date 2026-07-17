// Supabase Edge Function — AI Workforce Mobility Assistant proxy
// Runtime: Deno (Supabase managed)
//
// Environment variables required (set via `supabase secrets set`):
//   GEMINI_API_KEY — Google AI Studio API key (https://aistudio.google.com/apikey)
//
// Trigger:
//   POST /functions/v1/chat-ai   (called via supabase.functions.invoke('chat-ai'))
//   Public — the AI Assistant page is open to guests, so no role restriction.

// 'gemini-flash-latest' is Google's rolling alias for the current stable
// flash model — avoids hardcoding a version string that gets deprecated
// (gemini-2.5-flash stopped being available to this account's key).
const MODEL = 'gemini-flash-latest'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

const SYSTEM_PROMPT = `You are the WorkforceX AI Mobility Assistant, embedded in a platform that connects
international job seekers with verified, ethically-recruited overseas employment opportunities.

Help users with:
- Finding relevant job opportunities and understanding market demand
- Work visa requirements and application processes for different countries
- Skills training and certification recommendations
- Cultural preparation for working abroad
- Understanding ethical recruitment practices and worker protections

Keep responses concise, practical, and specific. Use markdown formatting (headers, bold, lists) where it
improves readability. If you don't have real-time data on a specific job listing, salary figure, or
country policy, say so plainly rather than inventing numbers — suggest the user check the Jobs
Marketplace or Skills Training pages on the platform, or speak with a mobility counselor.`

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface GeminiResponse {
  candidates?: {
    content?: { parts?: { text?: string }[] }
    finishReason?: string
  }[]
  promptFeedback?: { blockReason?: string }
}

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  const apiKey = Deno.env.get('GEMINI_API_KEY')
  if (!apiKey) {
    return json({ error: 'GEMINI_API_KEY is not configured' }, 500)
  }

  let messages: ChatMessage[]
  try {
    const body = await req.json()
    messages = body.messages
    if (!Array.isArray(messages) || messages.length === 0) {
      return json({ error: 'messages must be a non-empty array' }, 400)
    }
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        generationConfig: { maxOutputTokens: 1024 },
      }),
    })

    if (!res.ok) {
      console.error('Gemini API error:', res.status, await res.text())
      if (res.status === 429) {
        return json({ error: 'The assistant is receiving too many requests right now. Please try again shortly.' }, 429)
      }
      return json({ error: 'The assistant is temporarily unavailable. Please try again.' }, 502)
    }

    const data = await res.json() as GeminiResponse

    if (data.promptFeedback?.blockReason) {
      return json({
        reply: "I'm not able to help with that particular request. Feel free to ask me something else about jobs, visas, training, or working abroad.",
      })
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!reply) {
      return json({ error: 'The assistant returned an empty response. Please try again.' }, 502)
    }

    return json({ reply })
  } catch (err) {
    console.error('Unexpected chat-ai error:', err)
    return json({ error: 'Something went wrong. Please try again.' }, 500)
  }
})

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  })
}
