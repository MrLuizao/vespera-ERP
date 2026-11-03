# Especificación de Producto: Sistema Financiero & Legal (CFO Core) para Grupos Restauranteros de Alto Nivel en México

## 1. Resumen Ejecutivo y Alcance
Este sistema está concebido como una plataforma de **Dirección Financiera, Tesorería, Blindaje Fiscal y Gobierno Corporativo** dirigida al CFO de grupos restauranteros de alta gama y hospitalidad con múltiples conceptos y razones sociales en México.

El alcance se enfoca estratégicamente en:
* Blindaje tributario ante el SAT y cumplimiento del Código Fiscal de la Federación (CFF).
* Gestión de tesorería, dispersión bancaria y conciliación de cuentas por pagar (Three-Way Match).
* Gobernanza corporativa, cálculo de CUFIN, dividendos y contratos de arrendamiento comercial (NIF D-5).
* Inteligencia de reservas en tiempo real consumiendo Cloud Firestore (`booking-project-6d692`) para proyección anticipada de demanda y RevPASH.
* Consolidación financiera multientidad y reportes ejecutivos en tiempo real.

*(Nota: La microoperación de piso, comanderos, corte Z y aislamiento de propinas se mantienen diferidos en el backlog para priorizar la inteligencia de reservas, liquidez y blindaje fiscal SAT).*

---

## 2. Pilares Funcionales del Sistema

```
                      ┌──────────────────────────────────────┐
                      │    PANEL DE CONTROL CFO / BI         │
                      └──────────────────┬───────────────────┘
                                         │
     ┌───────────────────┬───────────────┴───────────────┬───────────────────┐
     ▼                   ▼                               ▼                   ▼
┌──────────────┐  ┌──────────────┐               ┌──────────────┐  ┌──────────────┐
│  BLINDAJE    │  │  TESORERÍA   │               │  GOBIERNO    │  │ INTELIGENCIA │
│  FISCAL SAT  │  │ & LIQUIDEZ   │               │ & CONTRATOS  │  │  FINANCIERA  │
└──────────────┘  └──────────────┘               └──────────────┘  └──────────────┘
```

---

## 3. Especificación de Módulos

### Módulo 1: Blindaje Fiscal SAT y Cumplimiento Regulatorio
1. **Auditoría Continua y Prevención Art. 69-B (EFOS):**
   * Consulta diaria automatizada contra las Listas Negras definitivas, presuntas y desvirtuadas del SAT.
   * Bloqueo inmediato de dispersiones a proveedores catalogados con irregularidades fiscales.
2. **Conciliación de CFDI 4.0 vs. Metadatos SAT:**
   * Descarga masiva diaria de metadata vía API SAT para identificar comprobantes cancelados por proveedores sin consentimiento.
   * Validación del match estricto entre UUIDs y registros de contabilidad electrónica.
3. **Aislamiento Fiscal de Propinas:**
   * Separación técnica e inmutable entre el ingreso propio de la operación y el flujo transitorio de propinas recibidas por tarjeta.
   * Conciliación auditable de la dispersión de propinas para prevenir que la autoridad fiscal las catalogue presuntivamente como ingresos acumulables de la persona moral o contingencias laborales/patronales ante el IMSS.
4. **Motor de Acreditamiento y Desglose de IEPS:**
   * Automatización de cuotas y tasas de IEPS (26.5%, 30% y 53%) para compras de destilados y vinos importados.
   * Cruce mensual automático contra la DIOT y la declaración mensual de IEPS.
5. **Cadena de Comprobantes PPD y REP:**
   * Monitoreo de Complementos de Recepción de Pagos pendientes con semáforos de riesgo fiscal y penalizaciones contractuales a proveedores morosos en timbrado.

---

### Módulo 2: Tesorería, Dispersión y Liquidaciones TPV
1. **Auditoría de Liquidaciones TPV (Adquirentes y Agregadores):**
   * Cruce algorítmico entre el corte Z de ventas con tarjeta, los depósitos en cuentas bancarias y las comisiones retenidas pactadas (tasa de descuento).
   * Alertas automáticas de contracargos (*chargebacks*), saldos congelados y comisiones no reconocidas.
2. **Cuentas por Pagar (AP) con Validación *Three-Way Match*:**
   * La orden de pago solo se libera si existe coincidencia perfecta entre:
     $$\text{CFDI XML (SAT)} \equiv \text{Orden de Compra Validada} \equiv \text{Recepción Formal de Almacén}$$
3. **Flujo de Pagos Masivos (SPEI Corporativo):**
   * Dispersión bancaria mancomunada con firmas digitales multifactor (MFA) para transferencias de alto valor (rentas, proteínas premium, vinos).
4. **Previsión de Flujo de Caja Dinámico (*13-Week Cash Flow*):**
   * Proyección semanal de liquidez considerando vencimientos de impuestos fijos (pagos provisionales de ISR, retenciones, cuotas IMSS/RCV), nómina y compromisos con proveedores clave.

---

### Módulo 3: Gobierno Corporativo, Contratos y Blindaje Legal
1. **Gestión de Arrendamientos Comerciales (NIF D-5 / IFRS 16):**
   * Auditoría de cobro de rentas variables (típicamente estructuradas como base fija + % de venta bruta).
   * Registro del derecho de uso del activo y amortizaciones de pasivos por arrendamiento.
   * Alertas de renovación, plazos de gracia y cartas fianza.
2. **Control de Accionistas y Estructura de Capital:**
   * Módulo para el cálculo y mantenimiento del saldo de la Cuenta de Utilidad Fiscal Neta (**CUFIN**).
   * Control de Aportaciones para Futuros Aumentos de Capital (AFAC) y cálculo de retenciones del 10% por pago de dividendos (Art. 140 LISR).
3. **Bóveda Legal y Poderes Notariales:**
   * Repositorio cifrado de escrituras públicas, actas de asamblea ordinarias/extraordinarias y poderes notariales con caducidad monitorizada.

---

### Módulo 4: Consolidación Multientidad e Inteligencia Financiera
1. **Consolidación Multirazón Social:**
   * Balance general y estado de resultados consolidados eliminando automáticamente transacciones y saldos intercompañía (*intercompany eliminations*).
2. **Métricas Financieras de Nivel C:**

| Métrica | Definición / Fórmula | Propósito para el CFO |
| :--- | :--- | :--- |
| **Prime Cost Consolidado** | $\frac{\text{Costo de Alimentos y Bebidas} + \text{Nómina Operativa Total}}{\text{Ventas Netas}}$ | Medir la viabilidad base del negocio (debe mantenerse típicamente $< 60\%-65\%$). |
| **EBITDAR** | $\text{EBITDA} + \text{Costos de Renta y Reestructuración}$ | Analizar el margen operativo puro aislando la variabilidad del costo inmobiliario. |
| **RevPASH** | $\frac{\text{Ingreso Total en Periodo}}{\text{Asientos Disponibles} \times \text{Horas Abiertas}}$ | Evaluar el rendimiento monetario por unidad de espacio/tiempo en horas pico y valle. |
| **DSO TPV** | $\frac{\text{Cuentas por Cobrar TPV}}{\text{Ventas con Tarjeta}} \times 30$ | Medir el tiempo real que toman los bancos adquirentes en fondear las cuentas operativas. |

---

## 4. Requisitos No Funcionales y Seguridad
* **Pistas de Auditoría Inmutables:** Bitácora tipo *Append-Only* para cada autorización de pago, cambio en catálogo contable o modificación de contratos.
* **Separación de Funciones (SoD):** El usuario que ingresa facturas para programación de pago no puede autorizar la dispersión bancaria ni firmar el lote SPEI.
* **Integración API RESTful:** Conexión hacia el POS (solo ingesta de resúmenes de venta y comisiones) y hacia el WebService del SAT y banca corporativa.

---

## 5. Arquitectura de Integración de APIs y Contratos de Servicio

El sistema opera como un **Hub Orquestador Financiero** mediante endpoints de servidor en Nuxt Nitro (`/server/api/cfo/...`) comunicándose con 4 familias de APIs críticas:

```
                  ┌──────────────────────────────────────────────┐
                  │       VESPERA HUB ERP (CFO CORE)             │
                  │   Nuxt 4 / Nitro Server Engine + Pinia Store │
                  └───────────────────────┬──────────────────────┘
                                          │
       ┌──────────────────┬───────────────┴───────────────┬──────────────────┐
       ▼                  ▼                               ▼                  ▼
┌──────────────┐   ┌──────────────┐                ┌──────────────┐   ┌──────────────┐
│  API SAT/PAC │   │  API POS/TPV │                │  BANCA SPEI  │   │  ARRENDADOR  │
│  CFDI & EFOS │   │  Cierres Z   │                │  Dispersión  │   │  Audit NIF-D5│
└──────────────┘   └──────────────┘                └──────────────┘   └──────────────┘
```

### 5.1. API SAT & Proveedores Autorizados de Certificación (PAC)
* **Objetivo:** Ingesta automática de comprobantes, detección de proveedores en Listas Negras (Art. 69-B) y conciliación contra cancelaciones unilaterales.
* **Endpoints Internos Nitro:**
  * `POST /api/cfo/sat/sync`: Sincronización masiva de metadatos de CFDI 4.0 del periodo.
  * `GET /api/cfo/sat/efos-check`: Cruce de RFCs de proveedores activos contra el listado del DOF (definitivos y presuntos).
  * `POST /api/cfo/sat/audit-anomalies`: Algoritmo de detección de inflación en costos unitarios de insumos críticos (carnes prime, destilados, vinos) comparando CFDI actual vs histórico.
* **Formato de Payload Clave (EFOS Alert):**
  ```json
  {
    "supplierRfc": "EFO190204AB1",
    "supplierName": "Distribuidora Fantasma S.A. de C.V.",
    "status": "DEFINITIVO_DOF",
    "publicationDate": "2026-10-15",
    "blockedPayments": 2,
    "retainedAmountMxn": 142500.00
  }
  ```

### 5.2. API Puntos de Venta (POS) y Liquidaciones TPV (Adquirentes)
* **Objetivo:** Ingesta de cortes Z de venta diaria, desagregación impositiva (IEPS/IVA) y aislamiento de propinas pagadas con tarjeta.
* **Endpoints Internos Nitro:**
  * `POST /api/cfo/pos/z-cut`: Recepción estandarizada de cierre de turno/día por sucursal.
  * `GET /api/cfo/pos/tips-reconciliation`: Reporte de propinas transitorias cobradas con tarjeta vs dispersadas a brigada para blindaje IMSS/SAT.
  * `POST /api/cfo/tpv/settlement-audit`: Comparativo entre liquidación bancaria del adquirente vs tasa de descuento pactada y corte Z.
* **Formato de Payload Clave (Corte Z Estandarizado):**
  ```json
  {
    "venueId": "woodnest",
    "date": "2026-11-02",
    "grossSales": 312500.00,
    "foodSales": 195000.00,
    "alcoholSales": 117500.00,
    "iepsCollected": 24675.00,
    "ivaCollected": 38750.00,
    "cardTipsCollected": 34500.00,
    "paymentBreakdown": {
      "cardAmex": 98000.00,
      "cardVisaMastercard": 218500.00,
      "cash": 30500.00
    }
  }
  ```

### 5.3. API Banca Corporativa & Dispersión SPEI (Three-Way Match)
* **Objetivo:** Automatización de pagos a proveedores y nómina previa validación estricta de documentos y autorización mancomunada.
* **Regla Three-Way Match:**
  ```
  [UUID CFDI 4.0 Vigente en SAT] + [Orden de Compra Aprobada] + [Entrada de Almacén Validadada] = Lote de Pago
  ```
* **Endpoints Internos Nitro:**
  * `POST /api/cfo/treasury/three-way-match`: Verificación documental previa a programar pago.
  * `POST /api/cfo/treasury/spei-batch`: Creación de lote de dispersión bancaria con tokens de firma mancomunada.
  * `GET /api/cfo/treasury/cash-flow-13w`: Proyección matricial de liquidez semanal considerando cobros TPV estimados y pasivos fijos/variables.

### 5.4. API Arrendamientos Comerciales & Auditoría (NIF D-5 / IFRS 16)
* **Objetivo:** Fiscalización y liquidación exacta de contratos de arrendamiento en plazas de primer nivel (renta base fija + variable por porcentaje de ventas brutas/netas).
* **Endpoints Internos Nitro:**
  * `GET /api/cfo/governance/lease-status`: Tablero de contratos, plazos, garantías y cálculo de renta variable del mes.

---

## 6. Modelo de Datos Central (`types/cfo.ts`)

A nivel código, el sistema tipa rígidamente:
1. `VenueFinancials`: Indicadores de cada sucursal (WoodNest, Kuroi, Ámbar) y consolidado de grupo.
2. `SatXmlAnomaly`: Alertas de inflación de insumos, proveedores EFOS y facturas canceladas.
3. `TpvSettlement`: Conciliación de tarjetas y comisiones adquirente.
4. `TipIsolationRecord`: Trazabilidad inmutable de propinas transitorias para prevención de contingencias fiscales y laborales.
5. `GovernancePaymentRequest`: Flujo de aprobaciones mancomunadas de socios y directores (SoD).
6. `CashFlowForecast13W`: Matriz de liquidez proyectada a 13 semanas.

---

## 7. Fases de Ejecución en `vespera-hub-ERP`

* **Fase 1 (Inmediata):** Unificación de identidad de marca a Vespera Hub ERP y contratos de API en Nuxt Server para auditoría SAT (EFOS y detección de sobreprecios).
* **Fase 2:** Módulo de Tesorería, Previsión 13-Week Cash Flow y conciliación de liquidaciones TPV.
* **Fase 3:** Aislamiento y dispersión fiscal de propinas con soporte de reportes para contador/fiscalista.
* **Fase 4:** Consolidación Multirazón Social, cálculo automático de CUFIN/AFAC y gobierno corporativo.
