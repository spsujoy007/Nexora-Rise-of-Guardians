import type { AIAnalysis, PollutionType, Severity } from './types'
import { isGeminiConfigured } from './firebase'

// ============================================================
// LIVE vs MOCK AI ENGINE
// ------------------------------------------------------------
// analyzeReport() below auto-switches: if VITE_GEMINI_API_KEY is set in
// frontend/.env, it calls the real Gemini API; otherwise it runs the
// deterministic mock so the app works with zero configuration. Nothing
// else in the app needs to change — every caller just awaits
// analyzeReport() and gets back the same AIAnalysis shape either way.
// ============================================================

const GEMINI_MODEL = 'gemini-2.5-flash'
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

export const ANALYSIS_PROMPT = `You are an environmental compliance analyst for an Indian municipal authority.
Given a citizen's photo report description, respond with STRICT JSON ONLY (no markdown fences, no prose) in exactly this shape:
{
  "pollutionType": one of "Air Smoke" | "Garbage Burning" | "Water Pollution" | "Illegal Dumping" | "Industrial Emission" | "Deforestation" | "Noise Pollution" | "Plastic Waste",
  "severity": one of "Low" | "Moderate" | "High" | "Critical",
  "confidence": integer 0-100,
  "possibleCause": short sentence,
  "healthRisk": short sentence,
  "suggestedActions": array of 2-3 short imperative strings for a municipal officer,
  "summary": one sentence summarizing the finding
}
Citizen description: `

async function analyzeReportLive(description: string, imageDataUrl?: string): Promise<AIAnalysis> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  const parts: Array<Record<string, unknown>> = [{ text: ANALYSIS_PROMPT + description }]

  if (imageDataUrl?.startsWith('data:')) {
    const [meta, base64] = imageDataUrl.split(',')
    const mimeMatch = meta.match(/data:(.*);base64/)
    parts.push({ inline_data: { mime_type: mimeMatch?.[1] ?? 'image/jpeg', data: base64 } })
  }

  const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  })

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}'
  const cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim()
  const parsed = JSON.parse(cleanText)

  return {
    pollutionType: parsed.pollutionType,
    severity: parsed.severity,
    confidence: parsed.confidence,
    possibleCause: parsed.possibleCause,
    healthRisk: parsed.healthRisk,
    suggestedActions: parsed.suggestedActions ?? [],
    summary: parsed.summary,
    duplicateOf: null,
  }
}

interface Keyword {
  words: string[]
  type: PollutionType
  cause: string
  risk: string
  actions: string[]
}

const KEYWORD_MAP: Keyword[] = [
  {
    words: ['smoke', 'burn', 'fire', 'burning'],
    type: 'Garbage Burning',
    cause: 'Open burning of solid waste, likely unsegregated municipal or agricultural waste.',
    risk: 'Elevated PM2.5 exposure — respiratory irritation for nearby residents, particularly children and the elderly.',
    actions: ['Dispatch fire safety & cleanup team', 'Notify ward sanitation officer', 'Advise nearby residents to avoid outdoor exposure for 6 hours'],
  },
  {
    words: ['river', 'water', 'drain', 'sewage', 'lake'],
    type: 'Water Pollution',
    cause: 'Untreated effluent or solid waste discharge into a waterway.',
    risk: 'Contamination risk to downstream water supply and aquatic ecosystems.',
    actions: ['Dispatch water quality inspection team', 'Notify pollution control board', 'Restrict water use downstream pending test results'],
  },
  {
    words: ['garbage', 'trash', 'dump', 'waste', 'litter'],
    type: 'Illegal Dumping',
    cause: 'Unauthorized waste disposal in a non-designated area.',
    risk: 'Breeding ground for pests and disease vectors; soil contamination over time.',
    actions: ['Schedule municipal waste pickup', 'Install signage / camera deterrent', 'Issue fine to responsible party if identifiable'],
  },
  {
    words: ['factory', 'industrial', 'chimney', 'chemical', 'emission'],
    type: 'Industrial Emission',
    cause: 'Unfiltered industrial exhaust exceeding permitted emission levels.',
    risk: 'High airborne toxin exposure — potential long-term respiratory and cardiovascular impact.',
    actions: ['Notify environmental compliance board', 'Request emergency emissions audit', 'Issue public air-quality advisory'],
  },
  {
    words: ['tree', 'forest', 'cutting', 'deforestation', 'logging'],
    type: 'Deforestation',
    cause: 'Unauthorized tree felling or land clearing.',
    risk: 'Loss of carbon sink capacity and local biodiversity disruption.',
    actions: ['Notify forestry department', 'Flag plot for satellite monitoring', 'Initiate replantation assessment'],
  },
  {
    words: ['plastic', 'bottle', 'bag', 'wrapper'],
    type: 'Plastic Waste',
    cause: 'Improper plastic waste disposal, likely single-use packaging.',
    risk: 'Microplastic accumulation in soil and waterways.',
    actions: ['Schedule cleanup drive', 'Notify local recycling partner', 'Flag zone for awareness campaign'],
  },
  {
    words: ['noise', 'loud', 'horn', 'construction'],
    type: 'Noise Pollution',
    cause: 'Unregulated construction or commercial noise exceeding permitted decibel levels.',
    risk: 'Chronic noise exposure linked to stress and sleep disruption for nearby residents.',
    actions: ['Notify noise control enforcement', 'Request decibel measurement survey', 'Issue compliance notice to source'],
  },
]

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

function pickSeverity(seed: number): Severity {
  const options: Severity[] = ['Moderate', 'High', 'High', 'Critical', 'Low']
  return options[seed % options.length]
}

/**
 * Analyzes an uploaded report (photo + description). Calls real Gemini
 * when VITE_GEMINI_API_KEY is set; otherwise runs the deterministic mock
 * below so the app works out of the box. If the live call fails for any
 * reason (bad key, quota, network), it falls back to the mock rather
 * than breaking the report flow.
 */
export async function analyzeReport(description: string, imageDataUrl?: string): Promise<AIAnalysis> {
  if (isGeminiConfigured) {
    try {
      return await analyzeReportLive(description, imageDataUrl)
    } catch (err) {
      console.error('Live Gemini analysis failed, falling back to mock:', err)
    }
  }
  return analyzeReportMock(description)
}

async function analyzeReportMock(description: string): Promise<AIAnalysis> {
  // simulate network + inference latency
  await new Promise((res) => setTimeout(res, 1400 + Math.random() * 900))

  const lower = description.toLowerCase()
  const seed = hashString(description || 'default-report')
  const match = KEYWORD_MAP.find((k) => k.words.some((w) => lower.includes(w))) ?? KEYWORD_MAP[0]
  const severity = pickSeverity(seed)
  const confidence = 82 + (seed % 17) // 82-98

  return {
    pollutionType: match.type,
    severity,
    confidence,
    possibleCause: match.cause,
    healthRisk: match.risk,
    suggestedActions: match.actions,
    duplicateOf: seed % 11 === 0 ? 'RPT-2291' : null,
    summary: `AI detected ${match.type.toLowerCase()} with ${confidence}% confidence, classified as ${severity} severity based on visual and contextual signals.`,
  }
}

export async function generateMunicipalSummary(reportCount: number, topType: PollutionType): Promise<string> {
  if (isGeminiConfigured) {
    try {
      return await generateMunicipalSummaryLive(reportCount, topType)
    } catch (err) {
      console.error('Live Gemini summary failed, falling back to mock:', err)
    }
  }
  return generateMunicipalSummaryMock(reportCount, topType)
}

async function generateMunicipalSummaryLive(reportCount: number, topType: PollutionType): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  const prompt = `You are an AI assistant for a municipal environmental dashboard. 
Write a single concise, professional sentence summarizing that ${reportCount} verified incidents were logged recently, and the leading issue is ${topType.toLowerCase()}. 
State that action is being prioritized.`

  const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  })

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  return text.trim() || generateMunicipalSummaryMock(reportCount, topType)
}

async function generateMunicipalSummaryMock(reportCount: number, topType: PollutionType): Promise<string> {
  await new Promise((res) => setTimeout(res, 900))
  return `Across the last reporting window, ${reportCount} verified incidents were logged, with ${topType.toLowerCase()} as the leading category. Guardian-submitted evidence is sufficient to prioritize dispatch to the top 3 hotspot zones this week.`
}
