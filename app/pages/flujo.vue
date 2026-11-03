<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Encabezado Principal -->
    <div class="mt-4 mb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 shrink-0 rounded-2xl bg-white/60 dark:bg-white/[0.08] backdrop-blur-2xl flex items-center justify-center shadow-sm">
          <UIcon
            name="i-lucide-sparkles"
            class="w-6 h-6 text-primary-500 dark:text-[#D4E157]"
          />
        </div>
        <div>
          <div class="flex items-center gap-2">
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
    <div class="rounded-[2rem] p-6 bg-white/60 dark:bg-white/[0.07] backdrop-blur-2xl shadow-lg border border-black/[0.03] dark:border-white/[0.05]">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span class="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-[#D4E157]">
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
          <div class="flex items-center gap-1 p-1 bg-white/80 dark:bg-black/30 rounded-xl border border-black/[0.04] dark:border-white/[0.06]">
            <button
              type="button"
              @click="cfoStore.setCashFlowMultiplier(0.85)"
              :class="cfoStore.cashFlowDemandMultiplier === 0.85 ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30' : 'text-sage-600 dark:text-gray-300 hover:text-carbon-900 dark:hover:text-white'"
              class="cursor-pointer px-3 py-1.5 rounded-lg text-xs transition-all"
            >
              Conservador (-15%)
            </button>
            <button
              type="button"
              @click="cfoStore.setCashFlowMultiplier(1.0)"
              :class="cfoStore.cashFlowDemandMultiplier === 1.0 ? 'bg-primary-500/20 text-primary-800 dark:text-[#D4E157] font-bold border border-primary-500/30' : 'text-sage-600 dark:text-gray-300 hover:text-carbon-900 dark:hover:text-white'"
              class="cursor-pointer px-3 py-1.5 rounded-lg text-xs transition-all"
            >
              Base (100%)
            </button>
            <button
              type="button"
              @click="cfoStore.setCashFlowMultiplier(1.2)"
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
            :class="cfoStore.cashFlowDeferCapex ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/25' : 'bg-white/80 dark:bg-black/30 text-carbon-800 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10'"
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
      <div class="rounded-[2rem] p-6 bg-white/60 dark:bg-white/[0.07] backdrop-blur-2xl shadow-lg border border-black/[0.02] dark:border-white/[0.04]">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-semibold text-sage-600 dark:text-gray-300 uppercase tracking-wider mb-1">
              Saldo Actual en Bancos
            </p>
            <p class="text-2xl sm:text-3xl font-bold tracking-tight text-carbon-900 dark:text-white font-mono">
              {{ formatCurrency(cfoStore.cashFlowForecast?.initialCashMxn || 1850000) }}
            </p>
          </div>
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8B80F9] to-[#6C5CE7] flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
            <UIcon name="i-lucide-wallet" class="w-5 h-5 text-white" />
          </div>
        </div>
        <p class="text-xs mt-3 text-sage-600 dark:text-gray-300">
          Cuentas operativas BBVA & Santander
        </p>
      </div>

      <!-- Saldo Proyectado Semana 13 -->
      <div class="rounded-[2rem] p-6 bg-white/60 dark:bg-white/[0.07] backdrop-blur-2xl shadow-lg border border-black/[0.02] dark:border-white/[0.04]">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-semibold text-sage-600 dark:text-gray-300 uppercase tracking-wider mb-1">
              Saldo Proyectado Sem 13
            </p>
            <p class="text-2xl sm:text-3xl font-bold tracking-tight font-mono" :class="(cfoStore.cashFlowForecast?.netChangeMxn || 0) >= 0 ? 'text-carbon-900 dark:text-[#D4E157]' : 'text-carbon-900 dark:text-white'">
              {{ formatCurrency(cfoStore.cashFlowForecast?.projectedEndingCashMxn || 1773500) }}
            </p>
          </div>
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4CD97B] to-[#2BB656] flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
            <UIcon name="i-lucide-trending-up" class="w-5 h-5 text-white" />
          </div>
        </div>
        <p class="text-xs mt-3 font-semibold" :class="(cfoStore.cashFlowForecast?.netChangeMxn || 0) >= 0 ? 'text-emerald-600 dark:text-[#D4E157]' : 'text-amber-600 dark:text-amber-400'">
          {{ (cfoStore.cashFlowForecast?.netChangeMxn || 0) >= 0 ? '↑ Ganancia Neta' : '↓ Delta Neto' }} {{ formatCurrency(cfoStore.cashFlowForecast?.netChangeMxn || -76500) }}
        </p>
      </div>

      <!-- Semana de Mayor Tensión -->
      <div class="rounded-[2rem] p-6 bg-white/60 dark:bg-white/[0.07] backdrop-blur-2xl shadow-lg border border-black/[0.02] dark:border-white/[0.04]">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-semibold text-sage-600 dark:text-gray-300 uppercase tracking-wider mb-1">
              Semana Mayor Tensión
            </p>
            <p class="text-xl sm:text-2xl font-bold tracking-tight text-carbon-900 dark:text-white">
              {{ cfoStore.cashFlowForecast?.criticalPinchWeek?.weekLabel || 'Sem 7 (Dic 14 - 20)' }}
            </p>
          </div>
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF9F43] to-[#EE5253] flex items-center justify-center shrink-0 shadow-md shadow-rose-500/20">
            <UIcon name="i-lucide-alert-triangle" class="w-5 h-5 text-white" />
          </div>
        </div>
        <p class="text-xs mt-3 text-sage-600 dark:text-gray-300">
          Valle de caja: <span class="font-bold font-mono text-amber-600 dark:text-amber-300">{{ formatCurrency(cfoStore.cashFlowForecast?.criticalPinchWeek?.projectedEndingCashMxn || 1538500) }}</span>
        </p>
      </div>

      <!-- Dividendo Máximo Seguro -->
      <div class="rounded-[2rem] p-6 bg-white/60 dark:bg-white/[0.07] backdrop-blur-2xl shadow-lg border border-black/[0.02] dark:border-white/[0.04]">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-semibold text-sage-600 dark:text-gray-300 uppercase tracking-wider mb-1">
              Dividendo Seguro Máximo
            </p>
            <p class="text-2xl sm:text-3xl font-bold tracking-tight text-carbon-900 dark:text-white font-mono">
              {{ formatCurrency(cfoStore.cashFlowForecast?.maximumDistributableDividendMxn || 790000) }}
            </p>
          </div>
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00D2D3] to-[#01A3A4] flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/20">
            <UIcon name="i-lucide-shield-check" class="w-5 h-5 text-white" />
          </div>
        </div>
        <p class="text-xs mt-3 text-sage-600 dark:text-gray-300">
          Blindando piso de reserva de {{ formatCurrency(cfoStore.cashFlowForecast?.safetyFloorThresholdMxn || 400000) }}
        </p>
      </div>
    </div>

    <!-- Tarjeta Diagnóstico Predictivo Copilot (IA) -->
    <UCard
      class="rounded-[2rem] border border-black/[0.03] dark:border-white/[0.05]"
      :ui="{ root: 'bg-white/60 dark:bg-white/[0.07] backdrop-blur-2xl ring-0 divide-y-0 shadow-lg', header: 'p-6 sm:px-7 sm:pt-7 sm:pb-0', body: 'p-6 sm:p-7' }"
    >
      <template #header>
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8B80F9] to-[#6C5CE7] flex items-center justify-center shadow-md shadow-indigo-500/20">
              <UIcon name="i-lucide-bot" class="w-5 h-5 text-white" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <p class="font-bold text-carbon-900 dark:text-white">
                  Diagnóstico Predictivo CFO Copilot
                </p>
                <UBadge color="primary" variant="soft" size="xs" class="font-bold">
                  IA GENERATIVA ACTIVA
                </UBadge>
              </div>
              <p class="text-xs text-sage-600 dark:text-gray-300">
                Análisis automatizado de confluencia fiscal, compromisos laborales y colchón de maniobra.
              </p>
            </div>
          </div>

          <div class="text-xs text-sage-600 dark:text-gray-400">
            Actualizado: Nov 2026
          </div>
        </div>
      </template>

      <div class="space-y-6">
        <!-- Titular & Diagnóstico -->
        <div class="p-5 rounded-2xl bg-primary-500/10 dark:bg-[#D4E157]/10 border border-primary-500/20 dark:border-[#D4E157]/20">
          <p class="text-sm font-bold text-carbon-900 dark:text-white">
            {{ cfoStore.cashFlowForecast?.aiExecutiveSummary?.headline || 'Liquidez Operativa Blindada: Flujo positivo con resiliencia ante obligaciones fiscales de fin de año.' }}
          </p>
          <p class="text-xs text-sage-700 dark:text-gray-200 mt-2 leading-relaxed">
            {{ cfoStore.cashFlowForecast?.aiExecutiveSummary?.riskDiagnosis || 'A lo largo de las 13 semanas proyectadas, el punto de máxima exigencia de caja ocurrirá en Sem 7 (Dic 14 - Dic 20), donde la liquidez alcanzará su valle proyectado en $1,538,500 MXN. El piso de maniobra ($400,000 MXN) se mantiene protegido.' }}
          </p>
        </div>

        <!-- 3 Prescripciones de Alto Impacto -->
        <div>
          <p class="text-xs font-bold uppercase tracking-wider text-sage-600 dark:text-gray-300 mb-3">
            Prescripciones Tácticas Sugeridas por el Motor Predictivo
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="rx in (cfoStore.cashFlowForecast?.aiExecutiveSummary?.prescriptions || [])"
              :key="rx.id"
              class="rounded-2xl p-4 bg-white/50 dark:bg-black/25 border border-black/[0.04] dark:border-white/[0.05] flex flex-col justify-between space-y-3"
            >
              <div>
                <div class="flex items-center justify-between mb-2">
                  <UBadge
                    :color="rx.category === 'RESERVAS' ? 'primary' : rx.category === 'IMPUESTOS' ? 'warning' : 'neutral'"
                    variant="subtle"
                    size="xs"
                    class="font-bold"
                  >
                    {{ rx.category }}
                  </UBadge>
                  <span class="font-mono text-xs font-bold text-emerald-600 dark:text-[#D4E157]">
                    +{{ formatCurrency(rx.impactMxn) }}
                  </span>
                </div>
                <p class="text-sm font-bold text-carbon-900 dark:text-white">
                  {{ rx.title }}
                </p>
                <p class="text-xs text-sage-600 dark:text-gray-300 mt-1 leading-relaxed">
                  {{ rx.action }}
                </p>
              </div>
              <div class="pt-2 border-t border-black/[0.04] dark:border-white/[0.05] flex items-center justify-between">
                <span class="text-[11px] text-sage-600 dark:text-gray-400">Impacto en liquidez</span>
                <span class="text-xs font-semibold text-carbon-900 dark:text-white">Semana 4 - 7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Matriz Desglosada de 13 Semanas -->
    <UCard
      class="rounded-[2rem] border border-black/[0.03] dark:border-white/[0.05]"
      :ui="{ root: 'bg-white/60 dark:bg-white/[0.07] backdrop-blur-2xl ring-0 divide-y-0 shadow-lg', header: 'p-6 sm:px-7 sm:pt-7 sm:pb-3', body: 'p-0 overflow-hidden' }"
    >
      <template #header>
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#67B8F7] to-[#3B9AE8] flex items-center justify-center shadow-md shadow-sky-500/20">
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

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="border-b border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02]">
              <th class="py-3 px-4 font-semibold text-sage-600 dark:text-gray-300 uppercase tracking-wider">Semana / Periodo</th>
              <th class="py-3 px-4 font-semibold text-sage-600 dark:text-gray-300 uppercase tracking-wider">Saldo Inicial</th>
              <th class="py-3 px-4 font-semibold text-sage-600 dark:text-gray-300 uppercase tracking-wider">Entradas (+)</th>
              <th class="py-3 px-4 font-semibold text-sage-600 dark:text-gray-300 uppercase tracking-wider">Salidas (-)</th>
              <th class="py-3 px-4 font-semibold text-sage-600 dark:text-gray-300 uppercase tracking-wider">Flujo Neto</th>
              <th class="py-3 px-4 font-semibold text-sage-600 dark:text-gray-300 uppercase tracking-wider">Saldo Final</th>
              <th class="py-3 px-4 font-semibold text-sage-600 dark:text-gray-300 uppercase tracking-wider">Estrés</th>
              <th class="py-3 px-4 font-semibold text-sage-600 dark:text-gray-300 uppercase tracking-wider">Eventos Clave</th>
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
                <div class="text-[11px] text-sage-600 dark:text-gray-400">
                  {{ w.startDate }} a {{ w.endDate }}
                </div>
              </td>

              <!-- Saldo Inicial -->
              <td class="py-3.5 px-4 font-mono text-carbon-800 dark:text-gray-200 whitespace-nowrap">
                {{ formatCurrency(w.startingCashMxn) }}
              </td>

              <!-- Entradas -->
              <td class="py-3.5 px-4 font-mono font-semibold text-emerald-600 dark:text-[#D4E157] whitespace-nowrap">
                +{{ formatCurrency(w.inflows.totalInflowsMxn) }}
              </td>

              <!-- Salidas -->
              <td class="py-3.5 px-4 font-mono font-semibold text-error-600 dark:text-error-400 whitespace-nowrap">
                -{{ formatCurrency(w.outflows.totalOutflowsMxn) }}
              </td>

              <!-- Flujo Neto -->
              <td class="py-3.5 px-4 font-mono font-bold whitespace-nowrap" :class="w.netCashFlowMxn >= 0 ? 'text-emerald-600 dark:text-[#D4E157]' : 'text-error-600 dark:text-error-400'">
                {{ w.netCashFlowMxn >= 0 ? '+' : '' }}{{ formatCurrency(w.netCashFlowMxn) }}
              </td>

              <!-- Saldo Final -->
              <td class="py-3.5 px-4 font-mono font-bold text-carbon-900 dark:text-white whitespace-nowrap">
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
                    :class="event.includes('Aguinaldos') ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/30' : event.includes('SAT') ? 'bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-500/30' : event.includes('Nómina') ? 'bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-500/30' : 'bg-black/5 dark:bg-white/10 text-carbon-700 dark:text-gray-300'"
                    class="px-2 py-0.5 rounded text-[10px] font-semibold border border-transparent whitespace-nowrap"
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
