import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { getFirestoreReservations } from './firebase'

export type ZoneId = 'terraza' | 'cava' | 'salon-principal'

export interface StoredReservation {
  id: string
  restaurantId: string
  zoneId: ZoneId
  guestName: string
  guestPhone: string
  partySize: number
  date: string
  time: string
  specialRequests?: string
  source: 'INSTAGRAM' | 'GOOGLE_MAPS' | 'DIRECT'
  status: 'CONFIRMED' | 'SEATED' | 'CANCELLED'
  applePassUrl?: string
  googleWalletUrl?: string
  createdAt: string
}

export interface ZoneMetrics {
  zoneId: ZoneId
  name: string
  capacity: number
  confirmedCovers: number
  confirmedTables: number
  averageTicketMxn: number
  projectedRevenueMxn: number
  occupancyRatePct: number
}

export interface ReservationFinancialSummary {
  totalConfirmedTables: number
  totalConfirmedCovers: number
  projectedRevenueMxn: number
  projectedPrimeCostMxn: number
  projectedNetContributionMxn: number
  zonesBreakdown: Record<ZoneId, ZoneMetrics>
  utmAttribution: {
    instagram: { covers: number; revenueMxn: number; pct: number }
    googleMaps: { covers: number; revenueMxn: number; pct: number }
    direct: { covers: number; revenueMxn: number; pct: number }
  }
  revpash: {
    totalSeats: number
    weekendOperatingHours: number
    totalAvailableSeatHours: number
    revpashMxn: number
  }
  reservations: StoredReservation[]
}

const ZONE_CONFIG: Record<ZoneId, { name: string; capacity: number; averageTicketMxn: number }> = {
  cava: {
    name: 'Cava Privada & Sommelier',
    capacity: 18,
    averageTicketMxn: 2200
  },
  terraza: {
    name: 'Terraza Fuego & Mixología',
    capacity: 42,
    averageTicketMxn: 1800
  },
  'salon-principal': {
    name: 'Salón Principal',
    capacity: 60,
    averageTicketMxn: 1400
  }
}

const DEFAULT_SEATS = 120
const WEEKEND_OPERATING_HOURS = 32 // Vie (12h) + Sáb (12h) + Dom (8h)

export function getLocalReservations(): StoredReservation[] {
  const possiblePaths = [
    resolve(process.cwd(), '.data/reservations.json'),
    resolve(process.cwd(), '../vespera-hub/.data/reservations.json'),
    '/Users/luis/Develop/Personal/vespera-hub/.data/reservations.json'
  ]

  for (const path of possiblePaths) {
    if (existsSync(path)) {
      try {
        const raw = readFileSync(path, 'utf-8')
        const data = JSON.parse(raw)
        return Object.values(data) as StoredReservation[]
      } catch (err) {
        console.warn(`[ReservationsSync] Error leyendo ${path}:`, (err as Error).message)
      }
    }
  }

  // Fallback con datos muestra de alta fidelidad si aún no hay reservas en disco
  return [
    {
      id: 'VH-5055',
      restaurantId: 'vespera-hub-metepec',
      zoneId: 'cava',
      guestName: 'Lic. Morales',
      guestPhone: '+52 722 591 0021',
      partySize: 4,
      date: '2026-11-06',
      time: '21:00',
      specialRequests: 'Maridaje Gran Reserva & Sommelier',
      source: 'INSTAGRAM',
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    },
    {
      id: 'VH-1923',
      restaurantId: 'vespera-hub-metepec',
      zoneId: 'terraza',
      guestName: 'Dr. Roberto Garza',
      guestPhone: '+52 55 4120 9988',
      partySize: 6,
      date: '2026-11-06',
      time: '20:30',
      specialRequests: 'Mesa cerca del fuego central',
      source: 'GOOGLE_MAPS',
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    },
    {
      id: 'VH-4136',
      restaurantId: 'vespera-hub-metepec',
      zoneId: 'salon-principal',
      guestName: 'Ana Sofía Valdés',
      guestPhone: '+52 722 344 1122',
      partySize: 4,
      date: '2026-11-07',
      time: '15:00',
      specialRequests: 'Celebración Aniversario',
      source: 'DIRECT',
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    }
  ]
}

export async function getLiveReservations(): Promise<{ reservations: StoredReservation[]; source: 'CLOUDFIRESTORE' | 'LOCAL_CACHE' }> {
  try {
    const firestoreData = await getFirestoreReservations()
    if (firestoreData && firestoreData.length > 0) {
      return {
        reservations: firestoreData,
        source: 'CLOUDFIRESTORE'
      }
    }
  } catch (err) {
    console.warn('[ReservationsSync] Error al consultar Firestore, usando respaldo:', (err as Error).message)
  }

  const local = getLocalReservations()
  return {
    reservations: local,
    source: 'LOCAL_CACHE'
  }
}

export function calculateReservationFinancials(reservations: StoredReservation[]): ReservationFinancialSummary {
  const confirmed = reservations.filter(r => r.status === 'CONFIRMED' || r.status === 'SEATED')

  const zonesBreakdown: Record<ZoneId, ZoneMetrics> = {
    cava: {
      zoneId: 'cava',
      name: ZONE_CONFIG.cava.name,
      capacity: ZONE_CONFIG.cava.capacity,
      confirmedCovers: 0,
      confirmedTables: 0,
      averageTicketMxn: ZONE_CONFIG.cava.averageTicketMxn,
      projectedRevenueMxn: 0,
      occupancyRatePct: 0
    },
    terraza: {
      zoneId: 'terraza',
      name: ZONE_CONFIG.terraza.name,
      capacity: ZONE_CONFIG.terraza.capacity,
      confirmedCovers: 0,
      confirmedTables: 0,
      averageTicketMxn: ZONE_CONFIG.terraza.averageTicketMxn,
      projectedRevenueMxn: 0,
      occupancyRatePct: 0
    },
    'salon-principal': {
      zoneId: 'salon-principal',
      name: ZONE_CONFIG['salon-principal'].name,
      capacity: ZONE_CONFIG['salon-principal'].capacity,
      confirmedCovers: 0,
      confirmedTables: 0,
      averageTicketMxn: ZONE_CONFIG['salon-principal'].averageTicketMxn,
      projectedRevenueMxn: 0,
      occupancyRatePct: 0
    }
  }

  let totalRevenue = 0
  let totalCovers = 0
  let totalTables = 0

  const utmMap: Record<'INSTAGRAM' | 'GOOGLE_MAPS' | 'DIRECT', { covers: number; revenueMxn: number }> = {
    INSTAGRAM: { covers: 0, revenueMxn: 0 },
    GOOGLE_MAPS: { covers: 0, revenueMxn: 0 },
    DIRECT: { covers: 0, revenueMxn: 0 }
  }

  for (const res of confirmed) {
    const zoneKey = res.zoneId in zonesBreakdown ? res.zoneId : 'salon-principal'
    const zone = zonesBreakdown[zoneKey]
    const covers = Number(res.partySize) || 2
    const rev = covers * zone.averageTicketMxn

    zone.confirmedCovers += covers
    zone.confirmedTables += 1
    zone.projectedRevenueMxn += rev

    totalCovers += covers
    totalTables += 1
    totalRevenue += rev

    const src = (res.source || 'DIRECT').toUpperCase() as 'INSTAGRAM' | 'GOOGLE_MAPS' | 'DIRECT'
    if (src in utmMap) {
      utmMap[src].covers += covers
      utmMap[src].revenueMxn += rev
    } else {
      utmMap.DIRECT.covers += covers
      utmMap.DIRECT.revenueMxn += rev
    }
  }

  // Porcentajes de ocupación por zona
  for (const z of Object.values(zonesBreakdown)) {
    z.occupancyRatePct = z.capacity > 0 ? Math.min(100, Math.round((z.confirmedCovers / z.capacity) * 100)) : 0
  }

  // Costo Primo proyectado (Food & Beverage Cost aprox 31% + Nómina variable de fin de semana aprox 18% = 49%)
  const primeCostRate = 0.49
  const projectedPrimeCost = totalRevenue * primeCostRate
  const projectedNetContribution = totalRevenue - projectedPrimeCost

  // RevPASH: Revenue / (Asientos * Horas)
  const totalAvailableSeatHours = DEFAULT_SEATS * WEEKEND_OPERATING_HOURS
  const revpash = totalAvailableSeatHours > 0 ? Number((totalRevenue / totalAvailableSeatHours).toFixed(2)) : 0

  // Porcentajes de atribución
  const utmAttribution = {
    instagram: {
      covers: utmMap.INSTAGRAM.covers,
      revenueMxn: utmMap.INSTAGRAM.revenueMxn,
      pct: totalRevenue > 0 ? Math.round((utmMap.INSTAGRAM.revenueMxn / totalRevenue) * 100) : 0
    },
    googleMaps: {
      covers: utmMap.GOOGLE_MAPS.covers,
      revenueMxn: utmMap.GOOGLE_MAPS.revenueMxn,
      pct: totalRevenue > 0 ? Math.round((utmMap.GOOGLE_MAPS.revenueMxn / totalRevenue) * 100) : 0
    },
    direct: {
      covers: utmMap.DIRECT.covers,
      revenueMxn: utmMap.DIRECT.revenueMxn,
      pct: totalRevenue > 0 ? Math.round((utmMap.DIRECT.revenueMxn / totalRevenue) * 100) : 0
    }
  }

  return {
    totalConfirmedTables: totalTables,
    totalConfirmedCovers: totalCovers,
    projectedRevenueMxn: totalRevenue,
    projectedPrimeCostMxn: projectedPrimeCost,
    projectedNetContributionMxn: projectedNetContribution,
    zonesBreakdown,
    utmAttribution,
    revpash: {
      totalSeats: DEFAULT_SEATS,
      weekendOperatingHours: WEEKEND_OPERATING_HOURS,
      totalAvailableSeatHours,
      revpashMxn: revpash
    },
    reservations: confirmed
  }
}
