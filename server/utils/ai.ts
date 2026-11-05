import { z } from 'zod'

/**
 * Motor de IA real (Google Gemini) para el resumen ejecutivo del flujo de caja 13S.
 * - Server-side únicamente: la API key jamás llega al cliente.
 * - Si no hay key, falla la red o el JSON no valida, se usa el resumen
 *   determinista (buildFallbackSummary) para nunca dejar la UI sin contenido.
 */

export interface AiPrescription {
  id: string
  title: string
  action: string
  impactMxn: number
  category: 'LIQUIDEZ' | 'IMPUESTOS' | 'RESERVAS' | 'DIVIDENDOS'
}

export interface AiExecutiveSummary {
  headline: string
  riskDiagnosis: string
  prescriptions: AiPrescription[]
}

/** Contexto compacto que recibe el LLM (sin PII de clientes). */
export interface AiCashFlowContext {
  scenario: {
    demandMultiplier: number
    deferCapex: boolean
  }
  initialCashMxn: number
  safetyFloorMxn: number
  lowestCashMxn: number
  maxSafeDividendMxn: number
  criticalPinch: {
    weekLabel: string
    reason: string
  }
  weeks: Array<{
    weekLabel: string
    inflowsMxn: number
    outflowsMxn: number
    endingCashMxn: number
    stressLevel: string
    keyEvents: string[]
  }>
  liveDemand: {
    source: 'CLOUDFIRESTORE' | 'LOCAL_CACHE'
    confirmedTables: number
    confirmedCovers: number
    projectedRevenueMxn: number
    projectedNetContributionMxn: number
    revpashMxn: number
    occupancyPctByZone: Record<string, number>
    topRevenueChannel: { channel: string; revenueMxn: number; pct: number } | null
  }
}

const prescriptionSchema = z.object({
  title: z.string().min(4),
  action: z.string().min(10),
  impactMxn: z.number().finite(),
  category: z.enum(['LIQUIDEZ', 'IMPUESTOS', 'RESERVAS', 'DIVIDENDOS'])
})

const executiveSummarySchema = z.object({
  headline: z.string().min(8).max(160),
  riskDiagnosis: z.string().min(40),
  prescriptions: z.array(prescriptionSchema).min(2).max(5)
})

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> }
  }>
}

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models'
const GEMINI_TIMEOUT_MS = 15000
// Failover: el modelo primario (recomendado por Google) puede estar en 503 por
// alta demanda; se cae al alternativo antes de recurrir al resumen determinista.
const GEMINI_FALLBACK_MODEL = 'gemini-3.5-flash'

/**
 * Resumen determinista de respaldo: es exactamente el comportamiento previo
 * a la integración de IA, movido aquí para usarlo como fallback garantizado.
 */
export function buildFallbackSummary(input: {
  lowestCashMxn: number
  safetyFloorMxn: number
  pinchWeekLabel: string
  maxSafeDividendMxn: number
}): AiExecutiveSummary {
  const { lowestCashMxn, safetyFloorMxn, pinchWeekLabel, maxSafeDividendMxn } = input
  const protectedFloor = lowestCashMxn >= safetyFloorMxn
  const buffer = Math.max(0, lowestCashMxn - safetyFloorMxn)

  return {
    headline: protectedFloor
      ? 'Liquidez Operativa Blindada: Flujo positivo con resiliencia ante obligaciones fiscales de fin de año.'
      : 'Alerta Preventiva de Tensión: La confluencia de aguinaldos y SAT en Semana 7 requiere anticipar depósitos de eventos.',
    riskDiagnosis: `A lo largo de las 13 semanas proyectadas, el punto de máxima exigencia de caja ocurrirá en ${pinchWeekLabel}, donde la liquidez alcanzará su valle proyectado en $${lowestCashMxn.toLocaleString('es-MX')} MXN. El piso de maniobra ($${safetyFloorMxn.toLocaleString('es-MX')} MXN) se mantiene ${protectedFloor ? `protegido con un colchón de $${buffer.toLocaleString('es-MX')} MXN` : 'comprometido por déficit temporal'}.`,
    prescriptions: [
      {
        id: 'rx-1',
        title: 'Anticipos de Cenas Corporativas (Diciembre)',
        action: 'Exigir depósito de garantía no reembolsable del 50% en las reservas de grupos corporativos de las Semanas 4 y 5.',
        impactMxn: 185000,
        category: 'RESERVAS'
      },
      {
        id: 'rx-2',
        title: 'Programación PPD Proveedores Destilados',
        action: 'Diferir el pago de facturas PPD de cavas y destilados con crédito pactado a 30 días para liberar flujo en la semana crítica.',
        impactMxn: 120000,
        category: 'LIQUIDEZ'
      },
      {
        id: 'rx-3',
        title: 'Tope Máximo de Dividendos Sugerido',
        action: `No distribuir más de $${maxSafeDividendMxn.toLocaleString('es-MX')} MXN a socios antes del cierre de Año Nuevo para preservar el capital de trabajo.`,
        impactMxn: maxSafeDividendMxn,
        category: 'DIVIDENDOS'
      }
    ]
  }
}

function buildPrompt(ctx: AiCashFlowContext): string {
  return `Eres el Director Financiero (CFO) de Vespera Hub ERP, grupo restaurantero de alta gama en Metepec, México (razones sociales WoodNest, Kuroi y Ámbar). Genera el resumen ejecutivo de una proyección de flujo de caja a 13 semanas.

CONTEXTO NUMÉRICO (JSON):
${JSON.stringify(ctx, null, 2)}

REGLAS:
1. Responde SOLO con JSON válido (sin markdown, sin texto fuera del JSON) con esta forma exacta:
{ "headline": string, "riskDiagnosis": string, "prescriptions": [ { "title": string, "action": string, "impactMxn": number, "category": "LIQUIDEZ" | "IMPUESTOS" | "RESERVAS" | "DIVIDENDOS" } ] }
2. headline: UNA sola frase (máx 90 caracteres) que destile el diagnóstico del escenario actual.
3. riskDiagnosis: 2 a 4 frases en español de México, sobrio y ejecutivo, citando SIEMPRE cifras reales del contexto: valle de caja proyectado, piso de seguridad, colchón/resto, semana crítica y qué dice la demanda real de Firestore.
4. prescriptions: EXACTAMENTE 3, ordenadas por impacto. Cada una debe ser específica, accionable y derivada de las cifras del contexto (impactMxn en MXN, número entero plausible). Aprovecha la demanda real de reservas (zonas, ocupación, canal de mayor ingreso) cuando sea relevante.
5. Tono CFO: preciso, sin marketing, sin emojis. Nunca inventes cifras que no estén en el contexto ni prometas retornos.`
}

/** Extrae el primer objeto JSON completo de una respuesta que pudo venir con ruido. */
export function extractJson(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('Respuesta sin JSON')
    return JSON.parse(match[0])
  }
}

export interface GeminiCallOptions {
  timeoutMs?: number
  maxOutputTokens?: number
  temperature?: number
}

/**
 * Llamada genérica a Gemini con failover de modelos (primario → 3.5-flash).
 * Lanza si no hay key o si todos los modelos fallan; el caller decide su fallback.
 */
export async function callGemini(
  prompt: string,
  options: GeminiCallOptions = {}
): Promise<{ text: string; model: string }> {
  const runtime = useRuntimeConfig()
  const apiKey = runtime.geminiApiKey || process.env.GEMINI_API_KEY || ''
  if (!apiKey) throw new Error('GEMINI_API_KEY no configurada')

  const primaryModel = runtime.geminiModel || process.env.GEMINI_MODEL || 'gemini-3.8-flash'
  const models = [...new Set([primaryModel, GEMINI_FALLBACK_MODEL])]

  // La API de Gemini puede responder 503 (alta demanda), timeout o 404 intermitente;
  // se itenta con cada modelo del failover antes de rendirse.
  let lastError: Error | null = null

  for (const model of models) {
    try {
      const response = await $fetch<GeminiResponse>(`${GEMINI_ENDPOINT}/${model}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: {
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: options.temperature ?? 0.35,
            maxOutputTokens: options.maxOutputTokens ?? 2048,
            responseMimeType: 'application/json',
            // El thinking por defecto se come los tokens y trunca la respuesta (MAX_TOKENS).
            thinkingConfig: { thinkingBudget: 0 }
          }
        },
        timeout: options.timeoutMs ?? GEMINI_TIMEOUT_MS
      })

      const text = response.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? '')
        .join('')
        .trim()

      if (!text) throw new Error('Respuesta vacía de Gemini')
      return { text, model }
    } catch (err) {
      lastError = err as Error
      console.warn(`[Gemini] Modelo ${model} falló:`, lastError.message)
    }
  }

  throw lastError ?? new Error('Gemini no disponible')
}

/**
 * Genera el resumen ejecutivo con Gemini. Nunca lanza: ante cualquier
 * fallo (sin key, timeout, JSON inválido) devuelve el fallback determinista.
 */
export async function generateExecutiveSummary(
  ctx: AiCashFlowContext
): Promise<AiExecutiveSummary> {
  const fallback = buildFallbackSummary({
    lowestCashMxn: ctx.lowestCashMxn,
    safetyFloorMxn: ctx.safetyFloorMxn,
    pinchWeekLabel: ctx.criticalPinch.weekLabel,
    maxSafeDividendMxn: ctx.maxSafeDividendMxn
  })

  try {
    const { text } = await callGemini(buildPrompt(ctx))
    const parsed = executiveSummarySchema.parse(extractJson(text))

    return {
      headline: parsed.headline,
      riskDiagnosis: parsed.riskDiagnosis,
      prescriptions: parsed.prescriptions.slice(0, 3).map((rx, index) => ({
        ...rx,
        id: `rx-${index + 1}`,
        impactMxn: Math.max(0, Math.round(rx.impactMxn))
      }))
    }
  } catch (err) {
    console.warn('[AiCashFlow] Gemini falló — usando resumen determinista:', (err as Error).message)
    return fallback
  }
}
