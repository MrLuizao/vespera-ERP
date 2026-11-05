<template>
  <div class="min-w-0">
    <div class="mb-8 mt-5 flex items-center justify-between flex-wrap gap-4">
      <div class="flex items-center gap-4">
        <div class="w-11 h-11 shrink-0 icon-tile flex items-center justify-center">
          <UIcon
            name="i-lucide-trending-up"
            class="w-5 h-5 text-carbon-800 dark:text-gray-200"
          />
        </div>
        <div>
          <h1 class="text-3xl sm:text-4xl font-bold text-carbon-900 dark:text-white tracking-tight">
            Punto de Equilibrio & P&L
          </h1>
          <p class="text-sage-600 dark:text-gray-300 mt-1 text-sm">
            Estado de Resultados · {{ cfoStore.activeFinancials.name }}
          </p>
        </div>
      </div>

      <!-- <UButton
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="subtle"
        size="lg"
        class="rounded-full"
        to="/main"
      >
        Volver
      </UButton> -->
    </div>

    <!-- KPI Cards Superiores con efecto Glass sin bordes blancos -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      <div class="glass-panel p-5 sm:p-6 min-w-0">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-medium text-sage-600 dark:text-gray-300 mb-1">
              Mi Dividendo ({{ cfoStore.currentPartner.equityPct }}%)
            </p>
            <p class="text-[28px] font-semibold tracking-tight text-highlighted tabular-nums">
              {{ formatCurrency(cfoStore.partnerDividendMxn) }}
            </p>
          </div>
          <div class="w-10 h-10 icon-tile flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-wallet" class="w-5 h-5 text-white" />
          </div>
        </div>
        <p class="text-sm mt-3 text-primary font-semibold">
          ↑ +{{ cfoStore.activeFinancials.growthVsLastMonthPct }}% vs mes anterior
        </p>
      </div>

      <div class="glass-panel p-5 sm:p-6 min-w-0">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-medium text-sage-600 dark:text-gray-300 mb-1">
              Utilidad Neta Distribuible
            </p>
            <p class="text-3xl font-bold tracking-tight text-carbon-900 dark:text-white">
              {{ formatCurrency(cfoStore.pnlSummary.netDistributableProfit) }}
            </p>
          </div>
          <div class="w-10 h-10 icon-tile flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-trending-up" class="w-5 h-5 text-white" />
          </div>
        </div>
        <p class="text-xs mt-3 text-sage-600 dark:text-gray-300">
          Margen Neto: {{ cfoStore.pnlSummary.netMarginPct }}% sobre ventas
        </p>
      </div>

      <div class="glass-panel p-5 sm:p-6 min-w-0">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-medium text-sage-600 dark:text-gray-300 mb-1">
              Proyección Fin de Semana
            </p>
            <p class="text-3xl font-bold tracking-tight text-carbon-900 dark:text-white">
              {{ formatCurrency(cfoStore.activeFinancials.weekendProjection.projectedRevenue) }}
            </p>
          </div>
          <div class="w-10 h-10 icon-tile flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-sparkles" class="w-5 h-5 text-white" />
          </div>
        </div>
        <p class="text-xs mt-3 text-sage-600 dark:text-gray-300">
          {{ cfoStore.activeFinancials.weekendProjection.confirmedVipTables }} mesas VIP confirmadas
        </p>
      </div>
    </div>

    <!-- Cascada de Estado de Resultados (P&L) & Semáforo en UCard Glassmorphism sin bordes blancos -->
    <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
      <UCard
        class="min-w-0"
        :ui="{ root: 'glass-panel ring-0 divide-y-0', header: 'p-5 sm:p-6 pb-0', body: 'p-5 sm:p-6' }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 shrink-0 icon-tile flex items-center justify-center">
              <UIcon
                name="i-lucide-bar-chart-3"
                class="w-5 h-5 text-white"
              />
            </div>
            <div>
              <p class="font-semibold text-carbon-900 dark:text-white">
                Cascada Estado de Resultados (P&L)
              </p>
              <p class="text-xs text-sage-600 dark:text-gray-300">
                Consolidado al Día {{ cfoStore.activeFinancials.currentDayOfMonth }} del mes
              </p>
            </div>
          </div>
        </template>

        <div class="divide-y divide-default">
          <div class="financial-row py-3.5">
            <span class="text-sm font-semibold text-muted">
              (+) Ventas Brutas
            </span>
            <span class="font-semibold text-highlighted financial-value">
              {{ formatCurrency(cfoStore.pnlSummary.grossRevenue) }}
            </span>
          </div>

          <div class="financial-row py-3.5">
            <span class="text-sm font-semibold text-muted">
              (-) Costo Insumos & Barra
            </span>
            <span class="font-semibold text-error-600 dark:text-error-400 financial-value">
              -{{ formatCurrency(cfoStore.pnlSummary.totalVariableCosts) }}
            </span>
          </div>

          <div class="financial-row py-3.5">
            <span class="text-sm font-semibold text-muted">
              (-) Renta, Nómina y Servicios
            </span>
            <span class="font-semibold text-error-600 dark:text-error-400 financial-value">
              -{{ formatCurrency(cfoStore.pnlSummary.totalFixedCosts) }}
            </span>
          </div>

          <div class="financial-row py-3.5">
            <span class="text-sm font-semibold text-muted">
              (-) Gastos Extraordinarios
            </span>
            <span class="font-semibold text-highlighted financial-value">
              -{{ formatCurrency(cfoStore.pnlSummary.approvedExtraExpenses) }}
            </span>
          </div>

          <div
            v-if="cfoStore.pnlSummary.recoveredSavingsFromSat > 0"
            class="financial-row py-3.5 status-success"
          >
            <span class="text-sm font-semibold text-primary">
              (+) Recuperado Auditoría SAT
            </span>
            <span class="font-bold text-primary financial-value">
              +{{ formatCurrency(cfoStore.pnlSummary.recoveredSavingsFromSat) }}
            </span>
          </div>

          <div class="financial-row px-3 py-4 status-success rounded-xl">
            <span class="text-sm font-bold text-carbon-900 dark:text-white">
              (=) Utilidad Neta Libre
            </span>
            <span class="font-bold text-primary tabular-nums text-lg">
              {{ formatCurrency(cfoStore.pnlSummary.netDistributableProfit) }}
            </span>
          </div>
        </div>
      </UCard>

      <!-- Semáforo de Costos Operativos -->
      <UCard
        class="min-w-0"
        :ui="{ root: 'glass-panel ring-0 divide-y-0', header: 'p-5 sm:p-6 pb-0', body: 'p-5 sm:p-6' }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 shrink-0 icon-tile flex items-center justify-center">
              <UIcon
                name="i-lucide-gauge"
                class="w-5 h-5 text-white"
              />
            </div>
            <div>
              <p class="font-semibold text-carbon-900 dark:text-white">
                Semáforo de Costo Real vs. Meta
              </p>
              <p class="text-xs text-sage-600 dark:text-gray-300">
                Calculado desde facturas XML del SAT
              </p>
            </div>
          </div>
        </template>

        <div class="space-y-4">
          <div class="flat-section pb-5">
            <div class="financial-row mb-2">
              <span class="text-sm font-semibold text-carbon-900 dark:text-white">
                Costo de Cocina (Food Cost)
              </span>
              <UBadge
                :color="cfoStore.activeFinancials.variableCosts.foodCostPct > cfoStore.activeFinancials.variableCosts.foodCostTargetPct ? 'warning' : 'success'"
                variant="soft"
              >
                {{ cfoStore.activeFinancials.variableCosts.foodCostPct }}% / Meta {{ cfoStore.activeFinancials.variableCosts.foodCostTargetPct }}%
              </UBadge>
            </div>
            <div class="h-3 w-full rounded-full bg-black/[0.06] dark:bg-black/40 overflow-hidden">
              <div
                aria-hidden="true" class="h-full rounded-full bg-royal-700 dark:bg-royal-300"
                :style="{ width: `${Math.min(100, cfoStore.activeFinancials.variableCosts.foodCostPct * 2.2)}%` }"
              />
            </div>
          </div>

          <div class="flat-section pb-5">
            <div class="financial-row mb-2">
              <span class="text-sm font-semibold text-carbon-900 dark:text-white">
                Costo de Barra & Cava
              </span>
              <UBadge
                :color="cfoStore.activeFinancials.variableCosts.beverageCostPct > cfoStore.activeFinancials.variableCosts.beverageCostTargetPct ? 'error' : 'success'"
                variant="soft"
              >
                {{ cfoStore.activeFinancials.variableCosts.beverageCostPct }}% / Meta {{ cfoStore.activeFinancials.variableCosts.beverageCostTargetPct }}%
              </UBadge>
            </div>
            <div class="h-3 w-full rounded-full bg-black/[0.06] dark:bg-black/40 overflow-hidden">
              <div
                aria-hidden="true" class="h-full rounded-full bg-brand-orange"
                :style="{ width: `${Math.min(100, cfoStore.activeFinancials.variableCosts.beverageCostPct * 2.5)}%` }"
              />
            </div>
          </div>

          <UButton
            to="/sat"
            block
            size="xl"
            color="primary"
            icon="i-lucide-file-search"
            class="mt-2 whitespace-normal text-center justify-center"
          >
            Auditar Facturas con Sobrecosto
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- ========================================================================= -->
    <!-- NUEVA SECCIÓN: Inteligencia de Reservas, RevPASH & Atribución de Ingresos -->
    <!-- ========================================================================= -->
    <div class="mt-8 space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 shrink-0 icon-tile flex items-center justify-center">
            <UIcon name="i-lucide-calendar-check-2" class="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-carbon-900 dark:text-white">
              Inteligencia de Reservas & RevPASH (Tiempo Real)
            </h2>
            <p class="text-xs text-sage-600 dark:text-gray-300">
              Pipeline de mesas VIP conectado directamente desde Vespera Hub Client
            </p>
          </div>
        </div>

        <UBadge
          color="primary"
          variant="soft"
          size="lg"
          class="rounded-full font-semibold self-start sm:self-auto"
        >
          RevPASH: {{ formatCurrency(cfoStore.revpashSummary.revpashMxn) }} / asiento-hora
        </UBadge>
      </div>

      <!-- Tarjetas de Métricas de Reservas: RevPASH + Ocupación + Atribución -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <!-- Tarjeta 1: RevPASH Detallado -->
        <div class="glass-panel min-w-0 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-semibold text-muted">
                Fórmula RevPASH
              </span>
              <UIcon name="i-lucide-calculator" class="w-4 h-4 text-primary" />
            </div>
            <p class="text-2xl font-bold text-carbon-900 dark:text-white">
              {{ formatCurrency(cfoStore.revpashSummary.revpashMxn) }}
            </p>
            <p class="text-xs text-sage-600 dark:text-gray-300 mt-1">
              Rendimiento por unidad de espacio/tiempo en fin de semana
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-black/[0.05] dark:border-white/[0.05] space-y-1 text-xs text-sage-600 dark:text-gray-300">
            <div class="flex justify-between">
              <span>Capacidad Instalada:</span>
              <span class="font-semibold text-carbon-900 dark:text-white">{{ cfoStore.revpashSummary.totalSeats }} asientos</span>
            </div>
            <div class="flex justify-between">
              <span>Horas de Servicio:</span>
              <span class="font-semibold text-carbon-900 dark:text-white">{{ cfoStore.revpashSummary.weekendOperatingHours }} hrs (Vie-Dom)</span>
            </div>
          </div>
        </div>

        <!-- Tarjeta 2: Atribución de Canales UTM -->
        <div class="glass-panel min-w-0 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-semibold text-muted">
                Atribución UTM de Reservas
              </span>
              <UIcon name="i-lucide-pie-chart" class="w-4 h-4 text-primary" />
            </div>
            <p class="text-2xl font-bold text-carbon-900 dark:text-white">
              {{ cfoStore.utmSummary.instagram.pct }}% <span class="text-xs font-normal text-sage-600 dark:text-gray-300">vía Instagram</span>
            </p>
            <p class="text-xs text-sage-600 dark:text-gray-300 mt-1">
              Retorno atribuible a pauta y canal VIP
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-black/[0.05] dark:border-white/[0.05] space-y-1.5 text-xs">
            <div class="flex justify-between items-center">
              <span class="flex items-center gap-1.5 text-sage-600 dark:text-gray-300">
                <span class="w-2 h-2 rounded-full bg-brand-orange" /> Instagram:
              </span>
              <span class="font-semibold text-highlighted financial-value">{{ formatCurrency(cfoStore.utmSummary.instagram.revenueMxn) }} ({{ cfoStore.utmSummary.instagram.covers }} covers)</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="flex items-center gap-1.5 text-sage-600 dark:text-gray-300">
                <span class="w-2 h-2 rounded-full bg-posyellow-400" /> Google Maps:
              </span>
              <span class="font-semibold text-highlighted financial-value">{{ formatCurrency(cfoStore.utmSummary.googleMaps.revenueMxn) }} ({{ cfoStore.utmSummary.googleMaps.covers }} covers)</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="flex items-center gap-1.5 text-sage-600 dark:text-gray-300">
                <span class="w-2 h-2 rounded-full bg-emerald-500" /> Directo / Web:
              </span>
              <span class="font-semibold text-highlighted financial-value">{{ formatCurrency(cfoStore.utmSummary.direct.revenueMxn) }} ({{ cfoStore.utmSummary.direct.covers }} covers)</span>
            </div>
          </div>
        </div>

        <!-- Tarjeta 3: Margen de Contribución de Reservas -->
        <div class="glass-panel min-w-0 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-semibold text-muted">
                Margen Contribución VIP
              </span>
              <UIcon name="i-lucide-coins" class="w-4 h-4 text-emerald-500" />
            </div>
            <p class="text-[28px] font-semibold text-highlighted tabular-nums">
              {{ formatCurrency(cfoStore.activeFinancials.weekendProjection.projectedNetContribution) }}
            </p>
            <p class="text-xs text-sage-600 dark:text-gray-300 mt-1">
              Flujo líquido proyectado tras Prime Cost (F&B + Nómina)
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-black/[0.05] dark:border-white/[0.05] space-y-1 text-xs text-sage-600 dark:text-gray-300">
            <div class="flex justify-between">
              <span>Ingreso Proyectado:</span>
              <span class="font-semibold text-highlighted financial-value">{{ formatCurrency(cfoStore.activeFinancials.weekendProjection.projectedRevenue) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Prime Cost (49%):</span>
              <span class="font-semibold text-error-600 dark:text-error-400 financial-value">-{{ formatCurrency(cfoStore.activeFinancials.weekendProjection.projectedRevenue * 0.49) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla / Cards de Desglose por Zona: Cava, Terraza, Salón -->
      <UCard
        class="min-w-0"
        :ui="{ root: 'glass-panel ring-0 divide-y-0', header: 'p-5 sm:p-6 pb-0', body: 'p-5 sm:p-6' }"
      >
        <template #header>
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 icon-tile flex items-center justify-center">
                <UIcon name="i-lucide-utensils-crossed" class="w-4 h-4 text-white" />
              </div>
              <p class="font-semibold text-carbon-900 dark:text-white">
                Ocupación y Consumo Proyectado por Zona
              </p>
            </div>
            <span class="text-xs text-sage-600 dark:text-gray-300">
              Vespera Hub Metepec
            </span>
          </div>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- Cava Privada -->
          <div class="flat-section py-4 space-y-3 min-w-0">
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-[var(--warning-text)]">Cava Privada</span>
              <UBadge color="warning" variant="subtle" size="sm">Ticket $2,200</UBadge>
            </div>
            <p class="text-xl font-bold text-carbon-900 dark:text-white">
              {{ formatCurrency(cfoStore.liveZonesBreakdown.cava?.projectedRevenueMxn || 17600) }}
            </p>
            <div class="text-xs text-sage-600 dark:text-gray-300 space-y-1">
              <div class="flex justify-between">
                <span>Capacidad:</span>
                <span class="font-semibold text-carbon-900 dark:text-white">{{ cfoStore.liveZonesBreakdown.cava?.capacity || 18 }} asientos</span>
              </div>
              <div class="flex justify-between">
                <span>Covers Confirmados:</span>
                <span class="font-semibold text-carbon-900 dark:text-white">{{ cfoStore.liveZonesBreakdown.cava?.confirmedCovers || 8 }} personas</span>
              </div>
            </div>
          </div>

          <!-- Terraza Fuego -->
          <div class="flat-section py-4 space-y-3 min-w-0">
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-[var(--attention-text)]">Terraza & Rooftop</span>
              <UBadge color="primary" variant="subtle" size="sm">Ticket $1,800</UBadge>
            </div>
            <p class="text-xl font-bold text-carbon-900 dark:text-white">
              {{ formatCurrency(cfoStore.liveZonesBreakdown.terraza?.projectedRevenueMxn || 25200) }}
            </p>
            <div class="text-xs text-sage-600 dark:text-gray-300 space-y-1">
              <div class="flex justify-between">
                <span>Capacidad:</span>
                <span class="font-semibold text-carbon-900 dark:text-white">{{ cfoStore.liveZonesBreakdown.terraza?.capacity || 42 }} asientos</span>
              </div>
              <div class="flex justify-between">
                <span>Covers Confirmados:</span>
                <span class="font-semibold text-carbon-900 dark:text-white">{{ cfoStore.liveZonesBreakdown.terraza?.confirmedCovers || 14 }} personas</span>
              </div>
            </div>
          </div>

          <!-- Salón Principal -->
          <div class="flat-section py-4 space-y-3 min-w-0">
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-primary">Salón Principal</span>
              <UBadge color="neutral" variant="subtle" size="sm">Ticket $1,400</UBadge>
            </div>
            <p class="text-xl font-bold text-carbon-900 dark:text-white">
              {{ formatCurrency(cfoStore.liveZonesBreakdown['salon-principal']?.projectedRevenueMxn || 22400) }}
            </p>
            <div class="text-xs text-sage-600 dark:text-gray-300 space-y-1">
              <div class="flex justify-between">
                <span>Capacidad:</span>
                <span class="font-semibold text-carbon-900 dark:text-white">{{ cfoStore.liveZonesBreakdown['salon-principal']?.capacity || 60 }} asientos</span>
              </div>
              <div class="flex justify-between">
                <span>Covers Confirmados:</span>
                <span class="font-semibold text-carbon-900 dark:text-white">{{ cfoStore.liveZonesBreakdown['salon-principal']?.confirmedCovers || 16 }} personas</span>
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCfoStore } from '~/stores/cfo'

const cfoStore = useCfoStore()

onMounted(() => {
  cfoStore.fetchReservations()
})

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0
  }).format(val)
}
</script>
