import { defineEventHandler } from 'h3'
import { getLiveReservations, calculateReservationFinancials } from '../../utils/reservations'

export default defineEventHandler(async () => {
  const { reservations, source } = await getLiveReservations()
  const financials = calculateReservationFinancials(reservations)

  return {
    status: 'OK',
    venue: 'Vespera Hub Metepec (Fuego, Cava & Lounge)',
    source,
    projectId: 'booking-project-6d692',
    totalInDb: reservations.length,
    syncedAt: new Date().toISOString(),
    financials
  }
})
