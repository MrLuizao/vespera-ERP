import { defineEventHandler, getQuery } from 'h3'
import { calculate13WeekCashFlow } from '../../../utils/cashflow'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const multiplier = query.demandMultiplier ? parseFloat(query.demandMultiplier as string) : 1.0
  const deferCapex = query.deferCapex === 'true'

  const forecast = await calculate13WeekCashFlow({
    reservationDemandMultiplier: multiplier,
    deferCapex
  })

  return {
    status: 'OK',
    forecast
  }
})
