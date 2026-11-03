import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
  return {
    status: 'OK',
    rfc: 'GWN2104159A1',
    syncedAt: new Date().toISOString(),
    xmlCount: 185,
    provider: 'Syntage SAT CFDI 4.0 Webhooks'
  }
})
