/**
 * Catálogo server-side de registros CFDI crudos para auditoría SAT.
 * Es la fuente de verdad que se manda a Gemini para análisis; el store del
 * cliente solo los consume vía GET /api/sat/audit.
 */

export type SatCfdiCategory =
  | 'INFLACION_INSUMO'
  | 'GASTO_ATIPICO'
  | 'PRECIO_NO_PACTADO'
  | 'LISTA_NEGRA_EFOS_69B'

export interface SatCfdiRecord {
  id: string
  venueId: 'woodnest' | 'kuroi' | 'ambar'
  venueName: string
  supplierName: string
  supplierRfc: string
  cfdiFolio: string
  date: string
  category: SatCfdiCategory
  title: string
  detail: string
  previousUnitPrice?: number
  billedUnitPrice?: number
  unit?: string
  pctIncrease?: number
  monthlyImpactMxn: number
  initialStatus: 'DETECTED' | 'BLOCKED'
}

const SAT_CFDI_CATALOG: SatCfdiRecord[] = [
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
    initialStatus: 'BLOCKED'
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
    initialStatus: 'DETECTED'
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
    initialStatus: 'DETECTED'
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
    initialStatus: 'DETECTED'
  },
  {
    id: 'sat-live-4',
    venueId: 'woodnest',
    venueName: 'WoodNest · Town Square',
    supplierName: 'Comercializadora Lácteos y Quesos Artesanales',
    supplierRfc: 'CLQ1902115M4',
    cfdiFolio: 'CFDI-9920X',
    date: 'Recién detectado en SAT',
    category: 'GASTO_ATIPICO',
    title: 'Factura duplicada mismo importe en menos de 48h',
    detail: 'Dos CFDIs emitidos por $12,600 MXN con los mismos lotes de Burrata e insumos importados.',
    monthlyImpactMxn: 12600,
    initialStatus: 'DETECTED'
  }
]

export function getSatCatalog(): SatCfdiRecord[] {
  return SAT_CFDI_CATALOG.map(record => ({ ...record }))
}
