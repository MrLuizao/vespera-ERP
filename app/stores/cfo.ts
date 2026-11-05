import { defineStore } from 'pinia'

export type VenueId = 'all' | 'woodnest' | 'kuroi' | 'ambar'

export interface VenueFinancials {
  id: VenueId
  name: string
  location: string
  rfc: string
  monthlyRevenue: number
  breakEvenTarget: number
  breakEvenDayReached: number
  currentDayOfMonth: number
  fixedCosts: {
    rent: number
    payrollBase: number
    utilitiesAndTech: number
  }
  variableCosts: {
    foodCostPct: number
    foodCostTargetPct: number
    beverageCostPct: number
    beverageCostTargetPct: number
    commissionsAndFeesPct: number
  }
  weekendProjection: {
    confirmedVipTables: number
    estimatedCovers: number
    projectedRevenue: number
    projectedNetContribution: number
  }
  growthVsLastMonthPct: number
}

export interface PartnerProfile {
  id: string
  username: string
  name: string
  role: 'Socio Director' | 'Socio Capitalista' | 'Socio Operador'
  equityPct: number
  investedCapital: number
  avatarInitials: string
  status: 'VOTED' | 'PENDING'
}

/** Análisis fiscal generado por IA (Gemini) — ver spec specs/sat-ai-audit.md. */
export interface SatAiAnalysis {
  plainExplanation: string
  fiscalRisk: string
  recommendedAction: string
  confidencePct: number
  legalReference: string
}

export interface SatXmlAnomaly {
  id: string
  venueId: Exclude<VenueId, 'all'>
  venueName: string
  supplierName: string
  supplierRfc: string
  cfdiFolio: string
  date: string
  category: 'INFLACION_INSUMO' | 'GASTO_ATIPICO' | 'PRECIO_NO_PACTADO' | 'LISTA_NEGRA_EFOS_69B'
  title: string
  detail: string
  previousUnitPrice?: number
  billedUnitPrice?: number
  unit?: string
  pctIncrease?: number
  monthlyImpactMxn: number
  status: 'DETECTED' | 'BLOCKED' | 'ACCEPTED'
  aiAnalysis?: SatAiAnalysis | null
}

export interface ZoneReservationMetric {
  zoneId: string
  name: string
  capacity: number
  confirmedCovers: number
  confirmedTables: number
  averageTicketMxn: number
  projectedRevenueMxn: number
  occupancyRatePct: number
}

export interface ReservationFinancialData {
  totalConfirmedTables: number
  totalConfirmedCovers: number
  projectedRevenueMxn: number
  projectedPrimeCostMxn: number
  projectedNetContributionMxn: number
  zonesBreakdown: Record<string, ZoneReservationMetric>
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
  reservations: any[]
}

export interface GovernanceSigner {
  partnerId: string
  partnerName: string
  role: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  signedAt?: string
}

export interface GovernancePaymentRequest {
  id: string
  venueId: Exclude<VenueId, 'all'>
  venueName: string
  Concept: string
  supplier: string
  cfdiUuid: string
  requestedBy: string
  requestedByPartnerId: string
  amountMxn: number
  category: 'CAPEX / EQUIPO' | 'PROVEEDOR EXTRA' | 'MANTENIMIENTO' | 'EVENTO ESPECIAL'
  createdAt: string
  approvalsCount: number
  requiredApprovals: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  signers: GovernanceSigner[]
}

export interface WeeklyCashFlowItem {
  weekNumber: number
  weekLabel: string
  startDate: string
  endDate: string
  startingCashMxn: number
  inflows: {
    reservationsMxn: number
    walkInSalesMxn: number
    corporateEventsMxn: number
    totalInflowsMxn: number
  }
  outflows: {
    payrollMxn: number
    taxesSatMxn: number
    socialSecurityImssMxn: number
    commercialRentMxn: number
    foodAndBeveragePurchasesMxn: number
    operatingServicesMxn: number
    capexApprovedMxn: number
    totalOutflowsMxn: number
  }
  netCashFlowMxn: number
  endingCashMxn: number
  minimumSafetyFloorMxn: number
  stressLevel: 'OPTIMAL' | 'MODERATE' | 'CRITICAL'
  keyEvents: string[]
}

export interface CashFlow13WReport {
  generatedAt: string
  horizonWeeks: number
  initialCashMxn: number
  projectedEndingCashMxn: number
  netChangeMxn: number
  safetyFloorThresholdMxn: number
  criticalPinchWeek: {
    weekNumber: number
    weekLabel: string
    stressLevel: string
    reason: string
    projectedEndingCashMxn: number
  }
  maximumDistributableDividendMxn: number
  aiExecutiveSummary: {
    headline: string
    riskDiagnosis: string
    prescriptions: {
      id: string
      title: string
      action: string
      impactMxn: number
      category: 'LIQUIDEZ' | 'IMPUESTOS' | 'RESERVAS' | 'DIVIDENDOS'
    }[]
  }
  weeks: WeeklyCashFlowItem[]
}

export const useCfoStore = defineStore('cfo', {
  state: () => ({
    selectedVenueId: 'all' as VenueId,
    selectedPartnerId: 'luis',
    isScanningSat: false,
    lastSatSync: 'Hace 8 min · 184 XMLs CFDI 4.0 procesados',
    // Estado de la última sincronización con análisis IA (spec sat-ai-audit §3)
    satAiSynced: false,
    satAiAvailable: false,
    satAiModel: null as string | null,
    satXmlCount: 184,
    isSyncingReservations: false,
    lastReservationsSync: 'Conectado a Vespera Hub API (En Vivo)',
    reservationFinancials: null as ReservationFinancialData | null,

    // Motor Predictivo de Flujo de Caja 13-Semanas con IA
    cashFlowForecast: null as CashFlow13WReport | null,
    isForecastingCashFlow: false,
    cashFlowDemandMultiplier: 1.0,
    cashFlowDeferCapex: false,

    venues: {
      woodnest: {
        id: 'woodnest',
        name: 'Vespera Hub · Metepec (Fuego & Cava)',
        location: 'Town Square Metepec · Cava & Rooftop',
        rfc: 'VES2204159A1',
        monthlyRevenue: 1480000,
        breakEvenTarget: 820000,
        breakEvenDayReached: 15,
        currentDayOfMonth: 24,
        fixedCosts: {
          rent: 165000,
          payrollBase: 245000,
          utilitiesAndTech: 68000
        },
        variableCosts: {
          foodCostPct: 29.2,
          foodCostTargetPct: 28.0,
          beverageCostPct: 21.4,
          beverageCostTargetPct: 20.0,
          commissionsAndFeesPct: 3.4
        },
        weekendProjection: {
          confirmedVipTables: 42,
          estimatedCovers: 190,
          projectedRevenue: 315000,
          projectedNetContribution: 118000
        },
        growthVsLastMonthPct: 16.8
      },
      kuroi: {
        id: 'kuroi',
        name: 'Kuroi Omakase & Raw Bar',
        location: 'Av. Tecnológico, Metepec',
        rfc: 'GWN2104159A1',
        monthlyRevenue: 960000,
        breakEvenTarget: 540000,
        breakEvenDayReached: 16,
        currentDayOfMonth: 24,
        fixedCosts: {
          rent: 98000,
          payrollBase: 162000,
          utilitiesAndTech: 44000
        },
        variableCosts: {
          foodCostPct: 31.8,
          foodCostTargetPct: 29.0,
          beverageCostPct: 19.5,
          beverageCostTargetPct: 20.0,
          commissionsAndFeesPct: 3.5
        },
        weekendProjection: {
          confirmedVipTables: 28,
          estimatedCovers: 112,
          projectedRevenue: 210000,
          projectedNetContribution: 79000
        },
        growthVsLastMonthPct: 21.4
      },
      ambar: {
        id: 'ambar',
        name: 'Ámbar Speakeasy & Mixology',
        location: 'La Providencia, Metepec',
        rfc: 'GWN2104159A1',
        monthlyRevenue: 690000,
        breakEvenTarget: 390000,
        breakEvenDayReached: 14,
        currentDayOfMonth: 24,
        fixedCosts: {
          rent: 75000,
          payrollBase: 110000,
          utilitiesAndTech: 32000
        },
        variableCosts: {
          foodCostPct: 18.0,
          foodCostTargetPct: 18.0,
          beverageCostPct: 26.8,
          beverageCostTargetPct: 21.0,
          commissionsAndFeesPct: 3.8
        },
        weekendProjection: {
          confirmedVipTables: 31,
          estimatedCovers: 140,
          projectedRevenue: 185000,
          projectedNetContribution: 82000
        },
        growthVsLastMonthPct: 12.1
      }
    } as Record<Exclude<VenueId, 'all'>, VenueFinancials>,

    partners: [
      {
        id: 'luis',
        username: 'luis.morales',
        name: 'Luis Morales',
        role: 'Socio Director',
        equityPct: 35,
        investedCapital: 2450000,
        avatarInitials: 'LM',
        status: 'VOTED'
      },
      {
        id: 'alejandro',
        username: 'alejandro.vega',
        name: 'Dr. Alejandro Vega',
        role: 'Socio Capitalista',
        equityPct: 25,
        investedCapital: 1750000,
        avatarInitials: 'AV',
        status: 'VOTED'
      },
      {
        id: 'roberto',
        username: 'roberto.garza',
        name: 'Ing. Roberto Garza',
        role: 'Socio Capitalista',
        equityPct: 25,
        investedCapital: 1750000,
        avatarInitials: 'RG',
        status: 'PENDING'
      },
      {
        id: 'mateo',
        username: 'mateo.silva',
        name: 'Chef Mateo Silva',
        role: 'Socio Operador',
        equityPct: 15,
        investedCapital: 1050000,
        avatarInitials: 'MS',
        status: 'VOTED'
      }
    ] as PartnerProfile[],

    satAnomalies: [
      {
        id: 'sat-efos-1',
        venueId: 'woodnest',
        venueName: 'Vespera Hub · Metepec',
        supplierName: 'Distribuidora Logística del Valle S.A. de C.V.',
        supplierRfc: 'DLV1805128T9',
        cfdiFolio: 'CFDI-8812E',
        date: 'Hoy, 09:15 AM',
        category: 'LISTA_NEGRA_EFOS_69B',
        title: 'Bloqueo Preventivo Art. 69-B SAT: Proveedor en Lista Negras DOF',
        detail: 'Cruce algorítmico detectó RFC publicado en el listado definitivo de presuntos EFOS. Dispersión bancaria SPEI congelada automáticamente.',
        monthlyImpactMxn: 68500,
        status: 'BLOCKED'
      },
      {
        id: 'sat-1',
        venueId: 'woodnest',
        venueName: 'WoodNest · Town Square',
        supplierName: 'Carnes Selectas del Valle S.A. de C.V.',
        supplierRfc: 'CSV1809124K9',
        cfdiFolio: 'CFDI-9841A',
        date: 'Hoy, 08:42 AM',
        category: 'INFLACION_INSUMO',
        title: 'Alza no pactada en Ribeye Prime Importado (+16.1%)',
        detail: 'El nodo XML <cfdi:Concepto> registra 85 kg facturados a $790/kg vs. $680/kg del tabulador autorizado.',
        previousUnitPrice: 680,
        billedUnitPrice: 790,
        unit: 'kg',
        pctIncrease: 16.1,
        monthlyImpactMxn: 24800,
        status: 'DETECTED'
      },
      {
        id: 'sat-2',
        venueId: 'ambar',
        venueName: 'Ámbar · Providencia',
        supplierName: 'Vinos y Destilados Premier de Toluca',
        supplierRfc: 'VDP1503228L2',
        cfdiFolio: 'CFDI-3310B',
        date: 'Ayer, 06:15 PM',
        category: 'PRECIO_NO_PACTADO',
        title: 'Desviación en Tequila Casa Dragones & Don Julio 70 (+11.4%)',
        detail: 'Se facturaron 18 botellas sin aplicar el descuento por volumen del 12% estipulado en contrato trimestral.',
        previousUnitPrice: 1620,
        billedUnitPrice: 1805,
        unit: 'botella',
        pctIncrease: 11.4,
        monthlyImpactMxn: 14400,
        status: 'DETECTED'
      },
      {
        id: 'sat-3',
        venueId: 'kuroi',
        venueName: 'Kuroi · Av. Tecnológico',
        supplierName: 'Importadora Toyosu Mariscos Frescos',
        supplierRfc: 'ITM2011047P1',
        cfdiFolio: 'CFDI-7721C',
        date: 'Hace 2 días',
        category: 'INFLACION_INSUMO',
        title: 'Incremento en Atún Aleta Azul & Hamachi (+13.8%)',
        detail: 'Tercera factura consecutiva con incremento escalonado por encima del tabulador de importación.',
        previousUnitPrice: 940,
        billedUnitPrice: 1070,
        unit: 'kg',
        pctIncrease: 13.8,
        monthlyImpactMxn: 18200,
        status: 'DETECTED'
      }
    ] as SatXmlAnomaly[],

    governanceRequests: [
      {
        id: 'gov-1',
        venueId: 'woodnest',
        venueName: 'WoodNest · Town Square',
        Concept: 'Compra de Cava Climatizada Dual EuroCave (180 botellas)',
        supplier: 'Equipos Gastronómicos Europeos S.A.',
        cfdiUuid: '8F4A-9921-C012',
        requestedBy: 'Mateo Silva (Socio Operador)',
        requestedByPartnerId: 'mateo',
        amountMxn: 48500,
        category: 'CAPEX / EQUIPO',
        createdAt: 'Hace 3 horas',
        approvalsCount: 2,
        requiredApprovals: 3,
        status: 'PENDING',
        signers: [
          { partnerId: 'mateo', partnerName: 'Mateo Silva', role: 'Socio Operador', status: 'APPROVED', signedAt: 'Ayer, 04:30 PM' },
          { partnerId: 'alejandro', partnerName: 'Dr. Alejandro Vega', role: 'Socio Capitalista', status: 'APPROVED', signedAt: 'Hoy, 09:15 AM' },
          { partnerId: 'luis', partnerName: 'Luis Morales', role: 'Socio Director', status: 'PENDING' },
          { partnerId: 'roberto', partnerName: 'Ing. Roberto Garza', role: 'Socio Capitalista', status: 'PENDING' }
        ]
      },
      {
        id: 'gov-2',
        venueId: 'ambar',
        venueName: 'Ámbar · Providencia',
        Concept: 'Renovación y Blindaje de Infraestructura de Servidores & ERP',
        supplier: 'Amazon Web Services / Google Cloud México',
        cfdiUuid: '3B19-4410-A887',
        requestedBy: 'Luis Morales (Socio Director)',
        requestedByPartnerId: 'luis',
        amountMxn: 38500,
        category: 'CAPEX / EQUIPO',
        createdAt: 'Hoy, 08:30 AM',
        approvalsCount: 1,
        requiredApprovals: 3,
        status: 'PENDING',
        signers: [
          { partnerId: 'luis', partnerName: 'Luis Morales', role: 'Socio Director', status: 'APPROVED', signedAt: 'Hoy, 08:30 AM' },
          { partnerId: 'alejandro', partnerName: 'Dr. Alejandro Vega', role: 'Socio Capitalista', status: 'PENDING' },
          { partnerId: 'mateo', partnerName: 'Mateo Silva', role: 'Socio Operador', status: 'PENDING' },
          { partnerId: 'roberto', partnerName: 'Ing. Roberto Garza', role: 'Socio Capitalista', status: 'PENDING' }
        ]
      },
      {
        id: 'gov-3',
        venueId: 'kuroi',
        venueName: 'Kuroi · Av. Tecnológico',
        Concept: 'Anticipo Lote Especial Wagyu A5 Miyazaki (Cena Maridaje)',
        supplier: 'Kobe Imports México',
        cfdiUuid: '7C91-1102-E541',
        requestedBy: 'Mateo Silva (Socio Operador)',
        requestedByPartnerId: 'mateo',
        amountMxn: 34000,
        category: 'EVENTO ESPECIAL',
        createdAt: 'Hace 2 días',
        approvalsCount: 3,
        requiredApprovals: 3,
        status: 'APPROVED',
        signers: [
          { partnerId: 'mateo', partnerName: 'Mateo Silva', role: 'Socio Operador', status: 'APPROVED', signedAt: 'Hace 2 días' },
          { partnerId: 'alejandro', partnerName: 'Dr. Alejandro Vega', role: 'Socio Capitalista', status: 'APPROVED', signedAt: 'Ayer, 11:20 AM' },
          { partnerId: 'luis', partnerName: 'Luis Morales', role: 'Socio Director', status: 'APPROVED', signedAt: 'Ayer, 05:40 PM' },
          { partnerId: 'roberto', partnerName: 'Ing. Roberto Garza', role: 'Socio Capitalista', status: 'PENDING' }
        ]
      }
    ] as GovernancePaymentRequest[]
  }),

  getters: {
    currentPartner(state): PartnerProfile {
      return state.partners.find(p => p.id === state.selectedPartnerId) || state.partners[0]!
    },

    activeFinancials(state): VenueFinancials {
      if (state.reservationFinancials && state.venues.woodnest) {
        state.venues.woodnest.weekendProjection = {
          confirmedVipTables: state.reservationFinancials.totalConfirmedTables,
          estimatedCovers: state.reservationFinancials.totalConfirmedCovers,
          projectedRevenue: state.reservationFinancials.projectedRevenueMxn,
          projectedNetContribution: state.reservationFinancials.projectedNetContributionMxn
        }
      }

      if (state.selectedVenueId !== 'all') {
        return state.venues[state.selectedVenueId]
      }
      const list = Object.values(state.venues)
      const totalRev = list.reduce((sum, v) => sum + v.monthlyRevenue, 0)
      const totalBE = list.reduce((sum, v) => sum + v.breakEvenTarget, 0)
      const totalRent = list.reduce((sum, v) => sum + v.fixedCosts.rent, 0)
      const totalPayroll = list.reduce((sum, v) => sum + v.fixedCosts.payrollBase, 0)
      const totalUtils = list.reduce((sum, v) => sum + v.fixedCosts.utilitiesAndTech, 0)

      const weightedFood = list.reduce((sum, v) => sum + (v.variableCosts.foodCostPct * v.monthlyRevenue), 0) / totalRev
      const weightedBev = list.reduce((sum, v) => sum + (v.variableCosts.beverageCostPct * v.monthlyRevenue), 0) / totalRev
      const weightedComm = list.reduce((sum, v) => sum + (v.variableCosts.commissionsAndFeesPct * v.monthlyRevenue), 0) / totalRev

      return {
        id: 'all',
        name: 'Consolidado Grupo (3 Unidades)',
        location: 'Corredor Metepec (Town Square · Tecnológico · Providencia)',
        rfc: 'GWN2104159A1',
        monthlyRevenue: totalRev,
        breakEvenTarget: totalBE,
        breakEvenDayReached: 15,
        currentDayOfMonth: 24,
        fixedCosts: {
          rent: totalRent,
          payrollBase: totalPayroll,
          utilitiesAndTech: totalUtils
        },
        variableCosts: {
          foodCostPct: Number(weightedFood.toFixed(1)),
          foodCostTargetPct: 26.5,
          beverageCostPct: Number(weightedBev.toFixed(1)),
          beverageCostTargetPct: 20.5,
          commissionsAndFeesPct: Number(weightedComm.toFixed(1))
        },
        weekendProjection: {
          confirmedVipTables: list.reduce((sum, v) => sum + v.weekendProjection.confirmedVipTables, 0),
          estimatedCovers: list.reduce((sum, v) => sum + v.weekendProjection.estimatedCovers, 0),
          projectedRevenue: list.reduce((sum, v) => sum + v.weekendProjection.projectedRevenue, 0),
          projectedNetContribution: list.reduce((sum, v) => sum + v.weekendProjection.projectedNetContribution, 0)
        },
        growthVsLastMonthPct: 17.2
      }
    },

    filteredAnomalies(state): SatXmlAnomaly[] {
      if (state.selectedVenueId === 'all') return state.satAnomalies
      return state.satAnomalies.filter(a => a.venueId === state.selectedVenueId)
    },

    filteredGovernanceRequests(state): GovernancePaymentRequest[] {
      if (state.selectedVenueId === 'all') return state.governanceRequests
      return state.governanceRequests.filter(g => g.venueId === state.selectedVenueId)
    },

    pnlSummary(): {
      grossRevenue: number
      totalFixedCosts: number
      totalVariableCosts: number
      approvedExtraExpenses: number
      recoveredSavingsFromSat: number
      netDistributableProfit: number
      netMarginPct: number
      breakEvenProgressPct: number
      surplusAboveBreakEven: number
    } {
      const f = this.activeFinancials
      const grossRevenue = f.monthlyRevenue
      const totalFixedCosts = f.fixedCosts.rent + f.fixedCosts.payrollBase + f.fixedCosts.utilitiesAndTech
      const totalVariablePct = f.variableCosts.foodCostPct + f.variableCosts.beverageCostPct + f.variableCosts.commissionsAndFeesPct
      const totalVariableCosts = Math.round(grossRevenue * (totalVariablePct / 100))

      const approvedExtraExpenses = this.filteredGovernanceRequests
        .filter(r => r.status === 'APPROVED')
        .reduce((sum, r) => sum + r.amountMxn, 0)

      const recoveredSavingsFromSat = this.filteredAnomalies
        .filter(a => a.status === 'BLOCKED')
        .reduce((sum, a) => sum + a.monthlyImpactMxn, 0)

      const netDistributableProfit = Math.max(
        0,
        grossRevenue - totalFixedCosts - totalVariableCosts - approvedExtraExpenses + recoveredSavingsFromSat
      )

      const netMarginPct = Number(((netDistributableProfit / grossRevenue) * 100).toFixed(1))
      const breakEvenProgressPct = Math.min(100, Math.round((grossRevenue / f.breakEvenTarget) * 100))
      const surplusAboveBreakEven = Math.max(0, grossRevenue - f.breakEvenTarget)

      return {
        grossRevenue,
        totalFixedCosts,
        totalVariableCosts,
        approvedExtraExpenses,
        recoveredSavingsFromSat,
        netDistributableProfit,
        netMarginPct,
        breakEvenProgressPct,
        surplusAboveBreakEven
      }
    },

    partnerDividendMxn(): number {
      const partner = this.currentPartner
      return Math.round(this.pnlSummary.netDistributableProfit * (partner.equityPct / 100))
    },

    partnerProjectedWeekendBonusMxn(): number {
      const partner = this.currentPartner
      return Math.round(this.activeFinancials.weekendProjection.projectedNetContribution * (partner.equityPct / 100))
    },

    pendingLeakageAmount(): number {
      return this.filteredAnomalies
        .filter(a => a.status === 'DETECTED')
        .reduce((sum, a) => sum + a.monthlyImpactMxn, 0)
    },

    pendingGovernanceCount(): number {
      return this.filteredGovernanceRequests.filter(r => r.status === 'PENDING').length
    },

    revpashSummary(state) {
      if (state.reservationFinancials) {
        return state.reservationFinancials.revpash
      }
      return {
        totalSeats: 120,
        weekendOperatingHours: 32,
        totalAvailableSeatHours: 3840,
        revpashMxn: 82.03
      }
    },

    utmSummary(state) {
      if (state.reservationFinancials) {
        return state.reservationFinancials.utmAttribution
      }
      return {
        instagram: { covers: 12, revenueMxn: 24200, pct: 45 },
        googleMaps: { covers: 8, revenueMxn: 16400, pct: 30 },
        direct: { covers: 6, revenueMxn: 13200, pct: 25 }
      }
    },

    liveZonesBreakdown(state) {
      if (state.reservationFinancials) {
        return state.reservationFinancials.zonesBreakdown
      }
      return {}
    },

    liveReservationsList(state) {
      return state.reservationFinancials?.reservations || []
    }
  },

  actions: {
    async fetchReservations() {
      this.isSyncingReservations = true
      try {
        const response = await $fetch<{
          status: string
          source: string
          projectId: string
          totalInDb: number
          financials: ReservationFinancialData
        }>('/api/cfo/reservations')

        if (response && response.financials) {
          this.reservationFinancials = response.financials
          const sourceLabel = response.source === 'CLOUDFIRESTORE' ? 'Cloud Firestore (Real)' : 'Caché Local'
          this.lastReservationsSync = `${sourceLabel} · ${response.totalInDb} reservaciones (${new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })})`
        }
      } catch (err) {
        console.warn('[CfoStore] Error al sincronizar reservaciones:', (err as Error).message)
      } finally {
        this.isSyncingReservations = false
      }
    },

    setVenue(id: VenueId) {
      this.selectedVenueId = id
    },

    setPartner(id: string) {
      this.selectedPartnerId = id
    },

    handleAnomalyAction(id: string, action: 'BLOCKED' | 'ACCEPTED') {
      const item = this.satAnomalies.find(a => a.id === id)
      if (item) {
        item.status = action
      }
    },

    handleGovernanceVote(id: string, decision: 'APPROVED' | 'REJECTED', partnerId?: string) {
      const req = this.governanceRequests.find(r => r.id === id)
      if (!req || req.status !== 'PENDING') return

      const activePartnerId = partnerId || this.selectedPartnerId
      const signer = req.signers?.find(s => s.partnerId === activePartnerId)

      if (signer) {
        signer.status = decision
        signer.signedAt = `Hoy, ${new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`
      }

      // Recalcular conteo de aprobaciones
      const approvedCount = req.signers?.filter(s => s.status === 'APPROVED').length || 0
      req.approvalsCount = approvedCount

      if (approvedCount >= req.requiredApprovals) {
        req.status = 'APPROVED'
      } else if (decision === 'REJECTED') {
        // Si hay rechazo formal
        const rejectedCount = req.signers?.filter(s => s.status === 'REJECTED').length || 0
        if (rejectedCount >= 2) {
          req.status = 'REJECTED'
        }
      }
    },

    updateGovernanceRequest(id: string, updates: Partial<GovernancePaymentRequest>) {
      const index = this.governanceRequests.findIndex(r => r.id === id)
      if (index !== -1) {
        this.governanceRequests[index] = {
          ...this.governanceRequests[index]!,
          ...updates
        }
      }
    },

    deleteGovernanceRequest(id: string) {
      this.governanceRequests = this.governanceRequests.filter(r => r.id !== id)
    },

    createGovernanceRequest(newReq: {
      venueId: Exclude<VenueId, 'all'>
      venueName: string
      Concept: string
      supplier: string
      cfdiUuid?: string
      requestedBy: string
      requestedByPartnerId: string
      amountMxn: number
      category: 'CAPEX / EQUIPO' | 'PROVEEDOR EXTRA' | 'MANTENIMIENTO' | 'EVENTO ESPECIAL'
    }) {
      const id = `gov-${Date.now()}`
      const signers: GovernanceSigner[] = this.partners.map(p => ({
        partnerId: p.id,
        partnerName: p.name,
        role: p.role,
        status: p.id === newReq.requestedByPartnerId ? 'APPROVED' : 'PENDING',
        signedAt: p.id === newReq.requestedByPartnerId ? 'Hoy, al crear solicitud' : undefined
      }))

      this.governanceRequests.unshift({
        id,
        venueId: newReq.venueId,
        venueName: newReq.venueName,
        Concept: newReq.Concept,
        supplier: newReq.supplier,
        cfdiUuid: newReq.cfdiUuid || `CFDI-${Math.floor(1000 + Math.random() * 9000)}-${newReq.venueId.toUpperCase()}`,
        requestedBy: newReq.requestedBy,
        requestedByPartnerId: newReq.requestedByPartnerId,
        amountMxn: newReq.amountMxn,
        category: newReq.category,
        createdAt: 'Justo ahora',
        approvalsCount: 1,
        requiredApprovals: 3,
        status: 'PENDING',
        signers
      })
    },

    /**
     * Sincronización real: llama a GET /api/cfo/sat/audit, que manda los
     * registros CFDI a Gemini y devuelve `aiAnalysis` por anomalía (o null si
     * la IA no está disponible → se conserva el detalle estático, spec §3).
     * Preserva las decisiones del usuario (BLOCKED/ACCEPTED) por id.
     * @returns true si la sincronización completó, false si el fetch falló.
     */
    async fetchSatAudit(): Promise<boolean> {
      if (this.isScanningSat) return false
      this.isScanningSat = true
      try {
        const response = await $fetch<{
          status: string
          aiModel: string | null
          aiAvailable: boolean
          syncedAt: string
          xmlCount: number
          anomalies: Array<SatXmlAnomaly & { initialStatus?: 'DETECTED' | 'BLOCKED' }>
        }>('/api/cfo/sat/audit')

        const previousDecisions = new Map(
          this.satAnomalies
            .filter(a => a.status === 'BLOCKED' || a.status === 'ACCEPTED')
            .map(a => [a.id, a.status] as const)
        )

        this.satAnomalies = response.anomalies.map(record => ({
          ...record,
          status: previousDecisions.get(record.id)
            ?? (record.initialStatus === 'BLOCKED' ? 'BLOCKED' : 'DETECTED')
        }))

        this.satAiSynced = true
        this.satAiAvailable = response.aiAvailable
        this.satAiModel = response.aiModel
        this.satXmlCount = response.xmlCount
        const syncTime = new Date(response.syncedAt).toLocaleTimeString('es-MX', {
          hour: '2-digit',
          minute: '2-digit'
        })
        this.lastSatSync = `Justo ahora (${syncTime}) · ${response.xmlCount} XMLs CFDI 4.0 auditados${
          response.aiAvailable ? ' con Análisis IA' : ''
        }`
        return true
      } catch (err) {
        console.warn('[SatAudit] Sincronización falló:', (err as Error).message)
        return false
      } finally {
        this.isScanningSat = false
      }
    },

    async fetchCashFlowForecast() {
      this.isForecastingCashFlow = true
      try {
        const response = await $fetch<{ status: string; forecast: CashFlow13WReport }>('/api/cfo/cashflow/forecast', {
          query: {
            demandMultiplier: this.cashFlowDemandMultiplier,
            deferCapex: this.cashFlowDeferCapex
          }
        })
        if (response && response.forecast) {
          this.cashFlowForecast = response.forecast
        }
      } catch (err) {
        console.warn('[CfoStore] Error al calcular proyección de flujo de caja 13W:', (err as Error).message)
      } finally {
        this.isForecastingCashFlow = false
      }
    },

    setCashFlowMultiplier(val: number) {
      this.cashFlowDemandMultiplier = val
      this.fetchCashFlowForecast()
    },

    setCashFlowDeferCapex(val: boolean) {
      this.cashFlowDeferCapex = val
      this.fetchCashFlowForecast()
    }
  }
})
