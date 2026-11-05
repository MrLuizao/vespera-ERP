import { z } from 'zod'
import { appendFileSync } from 'node:fs'
import { callGemini, extractJson } from './ai'
import type { SatCfdiRecord } from './sat-catalog'

// TEMPORAL: diagnóstico de fallos (se elimina tras el debug)
function debugLog(line: string): void {
  try { appendFileSync('/tmp/vespera-sat.log', `${new Date().toISOString()} ${line}\n`) } catch { /* noop */ }
}

/**
 * Análisis fiscal con IA para anomalías CFDI. Gemini recibe los registros
 * crudos y devuelve explicación en lenguaje claro, riesgo con artículo de ley,
 * acción recomendada, confianza y referencia legal por cada anomalía.
 * Si la IA no está disponible, retorna null y el cliente muestra el detalle
 * estático del catálogo (degradación elegante).
 */

export interface SatAiAnalysis {
  plainExplanation: string
  fiscalRisk: string
  recommendedAction: string
  confidencePct: number
  legalReference: string
}

const analysisSchema = z.object({
  plainExplanation: z.string().min(30).max(700),
  fiscalRisk: z.string().min(15).max(500),
  recommendedAction: z.string().min(10).max(400),
  confidencePct: z.number().min(0).max(100),
  legalReference: z.string().min(3).max(120)
})

const batchSchema = z.object({
  analyses: z
    .array(analysisSchema.extend({ id: z.string().min(1) }))
    .min(1)
    .max(10)
})

const SAT_AI_TIMEOUT_MS = 30000
const SAT_AI_MAX_TOKENS = 4096

function buildSatPrompt(records: SatCfdiRecord[]): string {
  return `Eres el auditor fiscal interno de Vespera Hub ERP, grupo restaurantero de alta gama en México. Analiza las anomalías CFDI detectadas en sus comprobantes.

REGISTROS CFDI (JSON):
${JSON.stringify(records, null, 2)}

REGLAS:
1. Responde SOLO con JSON válido (sin markdown) con esta forma exacta:
{ "analyses": [ { "id": string, "plainExplanation": string, "fiscalRisk": string, "recommendedAction": string, "confidencePct": number, "legalReference": string } ] }
2. Incluye EXACTAMENTE un elemento por cada registro recibido, con el mismo "id".
3. plainExplanation: 2 a 4 frases en español de México que un CFO entienda sin saber XML: qué pasó, contra qué referencia (tabulador, contrato o histórico) y cuánto dinero implica usar las cifras del registro.
4. fiscalRisk: consecuencia fiscal o contractual concreta (multa, bloqueo de dispersión, contingencia, pérdida de deducibilidad). Cita cifras SOLO las que están en el registro; nunca inventes montos.
5. recommendedAction: una sola acción inmediata y concreta (retener pago, solicitar nota de crédito, aceptar con reserva, escalar a legal, etc.).
6. confidencePct: 0 a 100 según solidez de la evidencia (RFC publicado en DOF = 95+; sobrecosto con tabulador claro = 80-90; gasto atípico sin histórico = 50-70).
7. legalReference: referencia legal o contractual real y aplicable (ej. "Art. 69-B CFF", "Art. 29-A CFF", "Cláusula 4.2 del contrato de compra"). No inventes artículos inexistentes; si no aplica uno legal estricto, usa la referencia contractual del registro.
8. Tono: sobrio, ejecutivo, sin emojis, sin marketing.`
}

/**
 * Analiza un lote de registros CFDI con Gemini.
 * Retorna el mapa id → análisis + modelo usado, o null si la IA no está disponible.
 */
export async function analyzeSatAnomalies(
  records: SatCfdiRecord[]
): Promise<{ analyses: Map<string, SatAiAnalysis>; model: string } | null> {
  if (records.length === 0) return null

  debugLog(`INICIO records=${records.length}`)
  try {
    const started = Date.now()
    const { text, model } = await callGemini(buildSatPrompt(records), {
      timeoutMs: SAT_AI_TIMEOUT_MS,
      maxOutputTokens: SAT_AI_MAX_TOKENS
    })
    debugLog(`GEMINI_OK model=${model} ms=${Date.now() - started} len=${text.length} head=${text.slice(0, 200)}`)

    const parsed = batchSchema.parse(extractJson(text))
    const analyses = new Map<string, SatAiAnalysis>()

    for (const item of parsed.analyses) {
      const { id, ...analysis } = item
      if (records.some(record => record.id === id)) {
        analyses.set(id, { ...analysis, confidencePct: Math.round(analysis.confidencePct) })
      }
    }

    if (analyses.size === 0) throw new Error('La respuesta no contiene análisis válidos')

    debugLog(`VALID_OK size=${analyses.size}`)
    return { analyses, model }
  } catch (err) {
    debugLog(`CATCH err=${(err as Error).message}`)
    console.warn('[SatAi] Análisis IA no disponible — se usará detalle estático:', (err as Error).message)
    return null
  }
}
