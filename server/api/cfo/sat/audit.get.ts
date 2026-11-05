import { defineEventHandler } from 'h3'
import { getSatCatalog } from '../../../utils/sat-catalog'
import { analyzeSatAnomalies, type SatAiAnalysis } from '../../../utils/sat-ai'
import type { SatCfdiRecord } from '../../../utils/sat-catalog'

export interface SatAuditResponse {
  status: 'OK'
  provider: string
  aiModel: string | null
  aiAvailable: boolean
  syncedAt: string
  xmlCount: number
  anomalies: Array<SatCfdiRecord & {
    status: 'DETECTED' | 'BLOCKED'
    aiAnalysis: SatAiAnalysis | null
  }>
}

export default defineEventHandler(async (): Promise<SatAuditResponse> => {
  const records = getSatCatalog()
  const result = await analyzeSatAnomalies(records)

  return {
    status: 'OK',
    provider: 'Google Gemini',
    aiModel: result?.model ?? null,
    aiAvailable: result !== null,
    syncedAt: new Date().toISOString(),
    xmlCount: 185,
    anomalies: records.map(record => ({
      ...record,
      status: record.initialStatus,
      aiAnalysis: result?.analyses.get(record.id) ?? null
    }))
  }
})
