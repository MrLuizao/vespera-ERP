import { getLiveReservations, calculateReservationFinancials } from './reservations'

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

export async function calculate13WeekCashFlow(scenarioModifiers?: {
  reservationDemandMultiplier?: number // e.g. 1.0 = normal, 0.85 = -15%, 1.2 = +20%
  deferCapex?: boolean
}): Promise<CashFlow13WReport> {
  const multiplier = scenarioModifiers?.reservationDemandMultiplier ?? 1.0
  const deferCapex = scenarioModifiers?.deferCapex ?? false

  // Obtener datos de reservaciones en vivo desde Firestore
  const { reservations } = await getLiveReservations()
  const liveFinancials = calculateReservationFinancials(reservations)

  const initialCash = 1850000 // $1,850,000 MXN en bancos
  const safetyFloor = 400000  // $400,000 MXN piso mínimo de seguridad

  const weeklySchedule = [
    {
      weekNumber: 1,
      weekLabel: 'Sem 1 (Nov 02 - Nov 08)',
      startDate: '2026-11-02',
      endDate: '2026-11-08',
      baseReservations: 168000,
      baseWalkIn: 144000,
      corporateEvents: 0,
      payroll: 0,
      taxesSat: 0,
      socialSecurityImss: 0,
      commercialRent: 165000, // Renta fija plaza
      fbPurchases: 142000,
      operatingServices: 28000,
      capex: 0,
      keyEvents: ['Pago de Renta Inmobiliaria Base Noviembre']
    },
    {
      weekNumber: 2,
      weekLabel: 'Sem 2 (Nov 09 - Nov 15)',
      startDate: '2026-11-09',
      endDate: '2026-11-15',
      baseReservations: 175000,
      baseWalkIn: 150000,
      corporateEvents: 0,
      payroll: 245000, // Quincena 15 Nov
      taxesSat: 0,
      socialSecurityImss: 0,
      commercialRent: 0,
      fbPurchases: 138000,
      operatingServices: 18000,
      capex: 0,
      keyEvents: ['Dispersión Nómina Quincenal (Día 15)']
    },
    {
      weekNumber: 3,
      weekLabel: 'Sem 3 (Nov 16 - Nov 22)',
      startDate: '2026-11-16',
      endDate: '2026-11-22',
      baseReservations: 195000,
      baseWalkIn: 165000,
      corporateEvents: 0,
      payroll: 0,
      taxesSat: 142000, // Pagos Provisionales ISR + IVA día 17
      socialSecurityImss: 62000, // Cuotas IMSS / RCV
      commercialRent: 0,
      fbPurchases: 145000,
      operatingServices: 22000,
      capex: deferCapex ? 0 : 48500, // Cava dual Eurocave si no se difiere
      keyEvents: ['Vencimiento Fiscal Día 17 SAT (ISR/IVA)', 'Cuotas Patronales IMSS/Infonavit', ...(deferCapex ? ['CAPEX Cava Diferido por Simulación'] : ['Compra CAPEX Cava Autorizada'])]
    },
    {
      weekNumber: 4,
      weekLabel: 'Sem 4 (Nov 23 - Nov 29)',
      startDate: '2026-11-23',
      endDate: '2026-11-29',
      baseReservations: 180000,
      baseWalkIn: 152000,
      corporateEvents: 45000, // Anticipos cenas empresas
      payroll: 0,
      taxesSat: 0,
      socialSecurityImss: 0,
      commercialRent: 0,
      fbPurchases: 158000,
      operatingServices: 34000,
      capex: 0,
      keyEvents: ['Anticipos de Cenas Corporativas Fin de Año']
    },
    {
      weekNumber: 5,
      weekLabel: 'Sem 5 (Nov 30 - Dic 06)',
      startDate: '2026-11-30',
      endDate: '2026-12-06',
      baseReservations: 188000,
      baseWalkIn: 155000,
      corporateEvents: 60000,
      payroll: 245000, // Quincena 30 Nov
      taxesSat: 0,
      socialSecurityImss: 0,
      commercialRent: 165000, // Renta Diciembre
      fbPurchases: 165000,
      operatingServices: 29000,
      capex: 0,
      keyEvents: ['Cierre de Mes: Nómina + Renta Diciembre']
    },
    {
      weekNumber: 6,
      weekLabel: 'Sem 6 (Dic 07 - Dic 13)',
      startDate: '2026-12-07',
      endDate: '2026-12-13',
      baseReservations: 225000,
      baseWalkIn: 185000,
      corporateEvents: 85000,
      payroll: 0,
      taxesSat: 0,
      socialSecurityImss: 0,
      commercialRent: 0,
      fbPurchases: 195000, // Acopio proteínas navideñas
      operatingServices: 35000,
      capex: 0,
      keyEvents: ['Inicio de Temporada Alta Cenas Navideñas']
    },
    {
      weekNumber: 7,
      weekLabel: 'Sem 7 (Dic 14 - Dic 20)',
      startDate: '2026-12-14',
      endDate: '2026-12-20',
      baseReservations: 245000,
      baseWalkIn: 210000,
      corporateEvents: 90000,
      payroll: 505000, // Nómina 15 Dic ($245k) + Aguinaldos LFT ($260k)
      taxesSat: 152000, // SAT 17 Dic
      socialSecurityImss: 65000, // IMSS 17 Dic
      commercialRent: 0,
      fbPurchases: 185000,
      operatingServices: 40000,
      capex: 0,
      keyEvents: ['Pico de Tensión Anual: Aguinaldos LFT + Nómina + SAT']
    },
    {
      weekNumber: 8,
      weekLabel: 'Sem 8 (Dic 21 - Dic 27)',
      startDate: '2026-12-21',
      endDate: '2026-12-27',
      baseReservations: 260000,
      baseWalkIn: 215000,
      corporateEvents: 40000,
      payroll: 0,
      taxesSat: 0,
      socialSecurityImss: 0,
      commercialRent: 0,
      fbPurchases: 175000,
      operatingServices: 30000,
      capex: 0,
      keyEvents: ['Semana de Nochebuena & Menús Especiales']
    },
    {
      weekNumber: 9,
      weekLabel: 'Sem 9 (Dic 28 - Ene 03)',
      startDate: '2026-12-28',
      endDate: '2027-01-03',
      baseReservations: 340000, // Gala Fin de Año
      baseWalkIn: 250000,
      corporateEvents: 50000,
      payroll: 245000, // Nómina 31 Dic
      taxesSat: 0,
      socialSecurityImss: 0,
      commercialRent: 165000, // Renta Enero
      fbPurchases: 180000,
      operatingServices: 35000,
      capex: 0,
      keyEvents: ['Gran Gala Fin de Año (Récord de Venta en Cava)']
    },
    {
      weekNumber: 10,
      weekLabel: 'Sem 10 (Ene 04 - Ene 10)',
      startDate: '2027-01-04',
      endDate: '2027-01-10',
      baseReservations: 145000,
      baseWalkIn: 125000,
      corporateEvents: 0,
      payroll: 0,
      taxesSat: 0,
      socialSecurityImss: 0,
      commercialRent: 0,
      fbPurchases: 110000,
      operatingServices: 22000,
      capex: 0,
      keyEvents: ['Ajuste Estacional de Demanda (Cuesta de Enero)']
    },
    {
      weekNumber: 11,
      weekLabel: 'Sem 11 (Ene 11 - Ene 17)',
      startDate: '2027-01-11',
      endDate: '2027-01-17',
      baseReservations: 152000,
      baseWalkIn: 130000,
      corporateEvents: 0,
      payroll: 245000, // Nómina 15 Ene
      taxesSat: 135000, // SAT 17 Ene
      socialSecurityImss: 58000, // IMSS 17 Ene
      commercialRent: 0,
      fbPurchases: 115000,
      operatingServices: 20000,
      capex: 0,
      keyEvents: ['Quincena Enero + Impuestos SAT / IMSS']
    },
    {
      weekNumber: 12,
      weekLabel: 'Sem 12 (Ene 18 - Ene 24)',
      startDate: '2027-01-18',
      endDate: '2027-01-24',
      baseReservations: 160000,
      baseWalkIn: 138000,
      corporateEvents: 0,
      payroll: 0,
      taxesSat: 0,
      socialSecurityImss: 0,
      commercialRent: 0,
      fbPurchases: 120000,
      operatingServices: 28000,
      capex: 0,
      keyEvents: ['Mantenimiento Preventivo Anual Equipos']
    },
    {
      weekNumber: 13,
      weekLabel: 'Sem 13 (Ene 25 - Ene 31)',
      startDate: '2027-01-25',
      endDate: '2027-01-31',
      baseReservations: 165000,
      baseWalkIn: 142000,
      corporateEvents: 0,
      payroll: 245000, // Nómina 30 Ene
      taxesSat: 0,
      socialSecurityImss: 0,
      commercialRent: 0,
      fbPurchases: 125000,
      operatingServices: 24000,
      capex: 0,
      keyEvents: ['Cierre Trimestral Q1 · Evaluación CUFIN']
    }
  ]

  let runningCash = initialCash
  const calculatedWeeks: WeeklyCashFlowItem[] = []
  let lowestCashPoint = initialCash
  let pinchWeekData = weeklySchedule[6]! // Default a Sem 7 (Aguinaldos)

  for (const item of weeklySchedule) {
    // Aplicar multiplicador de demanda a ingresos de reservaciones
    const reservationsRevenue = Math.round(item.baseReservations * multiplier)
    const walkInRevenue = Math.round(item.baseWalkIn * (1 + (multiplier - 1) * 0.6))
    const totalInflows = reservationsRevenue + walkInRevenue + item.corporateEvents

    const totalOutflows =
      item.payroll +
      item.taxesSat +
      item.socialSecurityImss +
      item.commercialRent +
      item.fbPurchases +
      item.operatingServices +
      item.capex

    const netCashFlow = totalInflows - totalOutflows
    const startingCash = runningCash
    const endingCash = startingCash + netCashFlow
    runningCash = endingCash

    if (endingCash < lowestCashPoint) {
      lowestCashPoint = endingCash
      pinchWeekData = item
    }

    let stressLevel: 'OPTIMAL' | 'MODERATE' | 'CRITICAL' = 'OPTIMAL'
    if (endingCash < safetyFloor) {
      stressLevel = 'CRITICAL'
    } else if (endingCash < safetyFloor * 1.5) {
      stressLevel = 'MODERATE'
    }

    calculatedWeeks.push({
      weekNumber: item.weekNumber,
      weekLabel: item.weekLabel,
      startDate: item.startDate,
      endDate: item.endDate,
      startingCashMxn: startingCash,
      inflows: {
        reservationsMxn: reservationsRevenue,
        walkInSalesMxn: walkInRevenue,
        corporateEventsMxn: item.corporateEvents,
        totalInflowsMxn: totalInflows
      },
      outflows: {
        payrollMxn: item.payroll,
        taxesSatMxn: item.taxesSat,
        socialSecurityImssMxn: item.socialSecurityImss,
        commercialRentMxn: item.commercialRent,
        foodAndBeveragePurchasesMxn: item.fbPurchases,
        operatingServicesMxn: item.operatingServices,
        capexApprovedMxn: item.capex,
        totalOutflowsMxn: totalOutflows
      },
      netCashFlowMxn: netCashFlow,
      endingCashMxn: endingCash,
      minimumSafetyFloorMxn: safetyFloor,
      stressLevel,
      keyEvents: item.keyEvents
    })
  }

  const finalCash = runningCash
  const netTotalChange = finalCash - initialCash

  // Margen de dividendo seguro que mantiene siempre la caja por encima de $400k
  const surplusAboveFloorAtLowest = lowestCashPoint - safetyFloor
  const maxSafeDividend = Math.max(0, Math.floor(surplusAboveFloorAtLowest * 0.7 / 10000) * 10000)

  return {
    generatedAt: new Date().toISOString(),
    horizonWeeks: 13,
    initialCashMxn: initialCash,
    projectedEndingCashMxn: finalCash,
    netChangeMxn: netTotalChange,
    safetyFloorThresholdMxn: safetyFloor,
    criticalPinchWeek: {
      weekNumber: pinchWeekData.weekNumber,
      weekLabel: pinchWeekData.weekLabel,
      stressLevel: lowestCashPoint < safetyFloor ? 'CRÍTICO' : 'MODERADO',
      reason: 'Confluencia obligatoria de Aguinaldos LFT, Nómina Quincenal y Pagos Provisionales SAT/IMSS.',
      projectedEndingCashMxn: lowestCashPoint
    },
    maximumDistributableDividendMxn: maxSafeDividend,
    aiExecutiveSummary: {
      headline: lowestCashPoint > safetyFloor
        ? 'Liquidez Operativa Blindada: Flujo positivo con resiliencia ante obligaciones fiscales de fin de año.'
        : 'Alerta Preventiva de Tensión: La confluencia de aguinaldos y SAT en Semana 7 requiere anticipar depósitos de eventos.',
      riskDiagnosis: `A lo largo de las 13 semanas proyectadas, el punto de máxima exigencia de caja ocurrirá en ${pinchWeekData.weekLabel}, donde la liquidez alcanzará su valle proyectado en $${lowestCashPoint.toLocaleString('es-MX')} MXN. El piso de maniobra ($400,000 MXN) se mantiene ${lowestCashPoint >= safetyFloor ? 'protegido con un colchón de $' + (lowestCashPoint - safetyFloor).toLocaleString('es-MX') + ' MXN' : 'comprometido por déficit temporal'}.`,
      prescriptions: [
        {
          id: 'rx-1',
          title: 'Anticipos de Cenas Corporativas (Diciembre)',
          action: 'Exigir depósito de garantía no reembolsable del 50% en las 14 reservas de grupos corporativos durante Semanas 4 y 5.',
          impactMxn: 185000,
          category: 'RESERVAS'
        },
        {
          id: 'rx-2',
          title: 'Programación PPD Proveedores Destilados',
          action: 'Diferir el pago de facturas PPD de cavas y destilados con crédito pactado a 30 días para liberar flujo en Semana 7.',
          impactMxn: 120000,
          category: 'LIQUIDEZ'
        },
        {
          id: 'rx-3',
          title: 'Tope Máximo de Dividendos Sugerido',
          action: `No distribuir más de $${maxSafeDividend.toLocaleString('es-MX')} MXN a socios antes del cierre de Año Nuevo (Semana 9) para preservar el capital de trabajo.`,
          impactMxn: maxSafeDividend,
          category: 'DIVIDENDOS'
        }
      ]
    },
    weeks: calculatedWeeks
  }
}
