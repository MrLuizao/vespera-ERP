<template>
  <div class="space-y-6 min-w-0">
    <!-- Encabezado Principal -->
    <div class="mt-4 mb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="w-11 h-11 shrink-0 icon-tile flex items-center justify-center">
          <UIcon
            name="i-lucide-sparkles"
            class="w-5 h-5 text-primary"
          />
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="text-3xl sm:text-4xl font-bold text-carbon-900 dark:text-white tracking-tight">
              Flujo Predictivo 13-S
            </h1>
            <UBadge color="primary" variant="soft" size="sm" class="font-bold">
              CFO COPILOT IA
            </UBadge>
          </div>
          <p class="text-sage-600 dark:text-gray-300 mt-1 text-sm">
            Simulación estocástica de tesorería y liquidez operativa a 13 semanas (Nov 2026 – Ene 2027)
          </p>
        </div>
      </div>

      <!-- Acciones de Cabecera -->
      <div class="flex items-center gap-2 self-start md:self-auto">
        <UButton
          color="neutral"
          variant="subtle"
          size="md"
          class="rounded-full cursor-pointer"
          icon="i-lucide-refresh-cw"
          :loading="cfoStore.isForecastingCashFlow"
          @click="cfoStore.fetchCashFlowForecast()"
        >
          Recalcular Proyección
        </UButton>
      </div>
    </div>

    <!-- Barra de Simulación "What-If" interactiva -->
    <div class="glass-panel p-5 sm:p-6">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-primary">
              Simulador de Liquidez "What-If"
            </span>
          </div>
          <p class="text-base font-bold text-carbon-900 dark:text-white">
            Sensibilidad de Demanda & Decisiones de CAPEX
          </p>
          <p class="text-xs text-sage-600 dark:text-gray-300">
            Modelado predictivo cruzando historial SAT (CFDI 4.0 de insumos y renta) con el pipeline de reservas VIP.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Selector de Escenario de Demanda -->
          <div class="flex flex-wrap items-center gap-1 p-1 bg-muted rounded-xl" role="group" aria-label="Escenario de demanda">
            <button
              type="button"
              @click="cfoStore.setCashFlowMultiplier(0.85)"
              :aria-pressed="cfoStore.cashFlowDemandMultiplier === 0.85"
              :class="cfoStore.cashFlowDemandMultiplier === 0.85 ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30' : 'text-sage-600 dark:text-gray-300 hover:text-carbon-900 dark:hover:text-white'"
              class="cursor-pointer px-3 py-1.5 rounded-lg text-xs transition-all"
            >
              Conservador (-15%)
            </button>
            <button
              type="button"
              @click="cfoStore.setCashFlowMultiplier(1.0)"
              :aria-pressed="cfoStore.cashFlowDemandMultiplier === 1.0"
              :class="cfoStore.cashFlowDemandMultiplier === 1.0 ? 'status-success font-bold border border-primary' : 'text-muted hover:text-highlighted'"
              class="cursor-pointer px-3 py-1.5 rounded-lg text-xs transition-all"
            >
              Base (100%)
            </button>
            <button
              type="button"
              @click="cfoStore.setCashFlowMultiplier(1.2)"
              :aria-pressed="cfoStore.cashFlowDemandMultiplier === 1.2"
              :class="cfoStore.cashFlowDemandMultiplier === 1.2 ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30' : 'text-sage-600 dark:text-gray-300 hover:text-carbon-900 dark:hover:text-white'"
              class="cursor-pointer px-3 py-1.5 rounded-lg text-xs transition-all"
            >
              Optimista (+20%)
            </button>
          </div>

          <!-- Toggle Diferir CAPEX -->
          <button
            type="button"
            @click="cfoStore.setCashFlowDeferCapex(!cfoStore.cashFlowDeferCapex)"
            :aria-pressed="cfoStore.cashFlowDeferCapex"
            :class="cfoStore.cashFlowDeferCapex ? 'bg-royal-500 text-carbon-950 font-bold' : 'bg-elevated text-default hover:bg-muted'"
            class="cursor-pointer px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 border border-black/[0.04] dark:border-white/[0.06] transition-all"
          >
            <UIcon :name="cfoStore.cashFlowDeferCapex ? 'i-lucide-check-circle-2' : 'i-lucide-clock'" class="w-4 h-4" />
            <span>Diferir CAPEX Cava ($48,500)</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 4 Tarjetas de Liquidez Ejecutiva -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <!-- Saldo Inicial en Bancos -->
      <div class="glass-panel min-w-0 p-5 sm:p-6">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-medium text-muted mb-1">
              Saldo Actual en Bancos
            </p>
            <p class="text-[28px] font-semibold tracking-tight text-highlighted tabular-nums">
              {{ formatCurrency(cfoStore.cashFlowForecast?.initialCashMxn || 1850000) }}
            </p>
          </div>
          <div class="w-10 h-10 icon-tile flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-wallet" class="w-5 h-5 text-white" />
          </div>
        </div>
        <p class="text-xs mt-3 text-sage-600 dark:text-gray-300">
          Cuentas operativas BBVA & Santander
        </p>
      </div>

      <!-- Saldo Proyectado Semana 13 -->
      <div class="glass-panel min-w-0 p-5 sm:p-6">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-medium text-muted mb-1">
              Saldo Proyectado Sem 13
            </p>
            <p class="text-[28px] font-semibold tracking-tight tabular-nums text-highlighted">
              {{ formatCurrency(cfoStore.cashFlowForecast?.projectedEndingCashMxn || 1773500) }}
            </p>
          </div>
          <div class="w-10 h-10 icon-tile flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-trending-up" class="w-5 h-5 text-white" />
          </div>
        </div>
        <p class="text-sm mt-3 font-semibold" :class="(cfoStore.cashFlowForecast?.netChangeMxn || 0) >= 0 ? 'text-primary' : 'text-[var(--warning-text)]'">
          {{ (cfoStore.cashFlowForecast?.netChangeMxn || 0) >= 0 ? '↑ Ganancia Neta' : '↓ Delta Neto' }} {{ formatCurrency(cfoStore.cashFlowForecast?.netChangeMxn || -76500) }}
        </p>
      </div>

      <!-- Semana de Mayor Tensión -->
      <div class="glass-panel min-w-0 p-5 sm:p-6">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-medium text-muted mb-1">
              Semana Mayor Tensión
            </p>
            <p class="text-xl sm:text-2xl font-bold tracking-tight text-carbon-900 dark:text-white">
              {{ cfoStore.cashFlowForecast?.criticalPinchWeek?.weekLabel || 'Sem 7 (Dic 14 - 20)' }}
            </p>
          </div>
          <div class="w-10 h-10 icon-tile flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-alert-triangle" class="w-5 h-5 text-white" />
          </div>
        </div>
        <p class="text-xs mt-3 text-sage-600 dark:text-gray-300">
          Valle de caja: <span class="font-semibold tabular-nums text-[var(--warning-text)]">{{ formatCurrency(cfoStore.cashFlowForecast?.criticalPinchWeek?.projectedEndingCashMxn || 1538500) }}</span>
        </p>
      </div>

      <!-- Dividendo Máximo Seguro -->
      <div class="glass-panel min-w-0 p-5 sm:p-6">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-medium text-muted mb-1">
              Dividendo Seguro Máximo
            </p>
            <p class="text-[28px] font-semibold tracking-tight text-highlighted tabular-nums">
              {{ formatCurrency(cfoStore.cashFlowForecast?.maximumDistributableDividendMxn || 790000) }}
            </p>
          </div>
          <div class="w-10 h-10 icon-tile flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-shield-check" class="w-5 h-5 text-white" />
          </div>
        </div>
        <p class="text-xs mt-3 text-sage-600 dark:text-gray-300">
          Blindando piso de reserva de {{ formatCurrency(cfoStore.cashFlowForecast?.safetyFloorThresholdMxn || 400000) }}
        </p>
      </div>
    </div>

    <!-- Matriz Desglosada de 13 Semanas -->
    <UCard
      class="forecast-table min-w-0"
      :ui="{ root: 'glass-panel ring-0 divide-y-0', header: 'p-5 sm:p-6', body: 'p-0 overflow-hidden' }"
    >
      <template #header>
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 icon-tile flex items-center justify-center">
              <UIcon name="i-lucide-calendar" class="w-5 h-5 text-white" />
            </div>
            <div>
              <p class="font-bold text-carbon-900 dark:text-white">
                Matriz Operativa de Flujo de Caja (13 Semanas)
              </p>
              <p class="text-xs text-sage-600 dark:text-gray-300">
                Desglose semana por semana de ingresos cobrados, salidas fijas/variables y saldo final.
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <UBadge color="neutral" variant="outline" size="sm" class="rounded-full">
              Horizonte: Nov 2026 - Ene 2027
            </UBadge>
          </div>
        </div>
      </template>

      <p class="px-5 pb-3 text-sm text-muted">Desplaza horizontalmente para consultar todas las columnas.</p>
      <div class="table-scroll" tabindex="0" role="region" aria-label="Flujo de caja: proyección de 13 semanas">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="border-b border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02]">
              <th scope="col" class="py-3 px-4 font-semibold text-muted">Semana / Periodo</th>
              <th scope="col" class="py-3 px-4 font-semibold text-muted">Saldo Inicial</th>
              <th scope="col" class="py-3 px-4 font-semibold text-muted">Entradas (+)</th>
              <th scope="col" class="py-3 px-4 font-semibold text-muted">Salidas (-)</th>
              <th scope="col" class="py-3 px-4 font-semibold text-muted">Flujo Neto</th>
              <th scope="col" class="py-3 px-4 font-semibold text-muted">Saldo Final</th>
              <th scope="col" class="py-3 px-4 font-semibold text-muted">Estrés</th>
              <th scope="col" class="py-3 px-4 font-semibold text-muted">Eventos Clave</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
            <tr
              v-for="w in (cfoStore.cashFlowForecast?.weeks || [])"
              :key="w.weekNumber"
              :class="w.weekNumber === cfoStore.cashFlowForecast?.criticalPinchWeek?.weekNumber ? 'bg-amber-500/[0.07] dark:bg-amber-500/[0.12] font-medium' : 'hover:bg-black/[0.015] dark:hover:bg-white/[0.02]'"
              class="transition-colors"
            >
              <!-- Semana -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <div class="font-bold text-carbon-900 dark:text-white">
                  Sem {{ w.weekNumber }}
                </div>
                <div class="text-xs text-muted">
                  {{ w.startDate }} a {{ w.endDate }}
                </div>
              </td>

              <!-- Saldo Inicial -->
              <td class="py-3.5 px-4 tabular-nums text-default whitespace-nowrap">
                {{ formatCurrency(w.startingCashMxn) }}
              </td>

              <!-- Entradas -->
              <td class="py-3.5 px-4 tabular-nums font-semibold text-primary whitespace-nowrap">
                +{{ formatCurrency(w.inflows.totalInflowsMxn) }}
              </td>

              <!-- Salidas -->
              <td class="py-3.5 px-4 tabular-nums font-semibold text-[var(--attention-text)] whitespace-nowrap">
                -{{ formatCurrency(w.outflows.totalOutflowsMxn) }}
              </td>

              <!-- Flujo Neto -->
              <td class="py-3.5 px-4 tabular-nums font-bold whitespace-nowrap" :class="w.netCashFlowMxn >= 0 ? 'text-primary' : 'text-error-600 dark:text-error-400'">
                {{ w.netCashFlowMxn >= 0 ? '+' : '' }}{{ formatCurrency(w.netCashFlowMxn) }}
              </td>

              <!-- Saldo Final -->
              <td class="py-3.5 px-4 tabular-nums font-bold text-highlighted whitespace-nowrap">
                {{ formatCurrency(w.endingCashMxn) }}
              </td>

              <!-- Estrés -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <UBadge
                  :color="w.stressLevel === 'CRITICAL' ? 'error' : w.stressLevel === 'MODERATE' ? 'warning' : 'success'"
                  variant="subtle"
                  size="xs"
                  class="font-bold"
                >
                  {{ w.stressLevel === 'CRITICAL' ? 'Crítico' : w.stressLevel === 'MODERATE' ? 'Moderado' : 'Óptimo' }}
                </UBadge>
              </td>

              <!-- Eventos Clave -->
              <td class="py-3.5 px-4">
                <div class="flex flex-wrap gap-1 max-w-xs">
                  <span
                    v-for="(event, idx) in w.keyEvents"
                    :key="idx"
                    :class="event.includes('Aguinaldos') ? 'status-warning' : event.includes('SAT') ? 'status-attention' : event.includes('Nómina') ? 'status-success' : 'bg-muted text-default'"
                    class="px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap"
                  >
                    {{ event }}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>
    <CashFlowAnalysis />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCfoStore } from '~/stores/cfo'

const cfoStore = useCfoStore()

onMounted(() => {
  cfoStore.fetchCashFlowForecast()
})

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0
  }).format(val || 0)
}
</script>
