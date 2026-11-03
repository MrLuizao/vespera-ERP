<template>
  <div class="max-w-5xl mx-auto">
    <!-- Encabezado limpio sin bordes blancos -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 mt-5">
      <div class="flex items-center gap-4">
        <div
          class="w-11 h-11 shrink-0 rounded-full bg-white/60 dark:bg-white/[0.08] backdrop-blur-2xl flex items-center justify-center shadow-sm">
          <UIcon name="i-lucide-layout-dashboard" class="w-5 h-5 text-carbon-800 dark:text-gray-200" />
        </div>
        <div>
          <h1 class="text-3xl sm:text-4xl font-bold text-carbon-900 dark:text-white tracking-tight">
            Panel Financiero
          </h1>
          <p class="text-xs text-sage-600 dark:text-gray-300 mt-0.5">
            {{ cfoStore.activeFinancials.name }}
          </p>
        </div>
      </div>

      <!-- Pill de Sincronización en Vivo con Vespera Hub API -->
      <div
        class="flex items-center gap-2 self-start sm:self-auto bg-white/50 dark:bg-white/[0.06] backdrop-blur-xl rounded-full px-3.5 py-1.5 border border-white/10 shadow-xs">
        <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span class="text-xs font-medium text-sage-700 dark:text-gray-300">
          {{ cfoStore.lastReservationsSync }}
        </span>
        <button
          class="ml-1 text-primary-500 hover:text-primary-400 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="cfoStore.isSyncingReservations" @click="cfoStore.fetchReservations()">
          <UIcon name="i-lucide-refresh-cw" class="w-3.5 h-3.5"
            :class="{ 'animate-spin': cfoStore.isSyncingReservations }" />
          <span>{{ cfoStore.isSyncingReservations ? 'Sincronizando...' : 'Actualizar' }}</span>
        </button>
      </div>
    </div>

    <!-- <p class="text-sage-600 dark:text-gray-300 -mt-6 mb-10 text-sm sm:text-base">
      Bienvenido, {{ cfoStore.currentPartner.name }} · {{ cfoStore.activeFinancials.name }}
    </p> -->

    <!-- Tarjeta Inferior Glassmorphism: Punto de Equilibrio (Sin ring blanco) -->
    <UCard class="rounded-[2rem]"
      :ui="{ root: 'bg-white/60 dark:bg-white/[0.07] backdrop-blur-2xl ring-0 divide-y-0 shadow-lg', body: 'p-6 sm:p-7' }">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br from-[#4CD97B] to-[#2BB656] flex items-center justify-center shadow-md shadow-emerald-500/20">
            <UIcon name="i-lucide-flame" class="w-5 h-5 text-white" />
          </div>
          <div>
            <p class="font-semibold text-carbon-900 dark:text-white">
              Punto de Equilibrio · Superado el Día {{ cfoStore.activeFinancials.breakEvenDayReached }}
            </p>
            <p class="text-xs text-sage-600 dark:text-gray-300">
              Costos fijos cubiertos al 100% ({{ formatCurrency(cfoStore.activeFinancials.breakEvenTarget) }})
            </p>
          </div>
        </div>

        <UBadge color="success" variant="soft" size="lg" class="rounded-full font-semibold self-start sm:self-auto">
          Excedente: +{{ formatCurrency(cfoStore.pnlSummary.surplusAboveBreakEven) }}
        </UBadge>
      </div>

      <div class="relative h-3.5 w-full rounded-full bg-black/[0.06] dark:bg-black/40 overflow-hidden mb-2.5">
        <div
          class="h-full rounded-full bg-gradient-to-r from-[#8B80F9] to-[#4CD97B] dark:from-[#D4E157] dark:to-[#4CD97B] transition-all duration-500"
          style="width: 88%" />
      </div>

      <div class="flex justify-between text-xs text-sage-600 dark:text-gray-300 font-medium">
        <span>Meta: {{ formatCurrency(cfoStore.activeFinancials.breakEvenTarget) }}</span>
        <span class="text-carbon-900 dark:text-white font-semibold">
          Ventas Actuales: {{ formatCurrency(cfoStore.pnlSummary.grossRevenue) }}
        </span>
      </div>
    </UCard>

    <!-- Contenedor Principal Glassmorphism (Con borde blanco muy sutil en modo oscuro) -->
    <div
      class="rounded-[2rem] bg-white/30 dark:bg-black/25 backdrop-blur-2xl dark:ring-1 dark:ring-white/[0.08] p-5 sm:p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.45)] mt-8">
      <div class="flex items-center justify-between mb-5 px-2">
        <h2 class="font-semibold text-carbon-900 dark:text-white">
          Resumen Directivo
        </h2>
        <span class="text-xs font-medium text-sage-700 dark:text-gray-300">
          Participación {{ cfoStore.currentPartner.equityPct }}%
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div v-for="op in cards" :key="op.title"
          class="rounded-[2rem] p-7 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group relative overflow-hidden bg-white/60 hover:bg-white/75 dark:bg-white/[0.07] dark:hover:bg-white/[0.11] backdrop-blur-2xl shadow-[0_8px_32px_rgba(15,23,42,0.05)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.3)]"
          @click="navigateTo(op.to)">
          <div class="flex items-start justify-between mb-8">
            <div>
              <p class="text-xs font-medium text-sage-600 dark:text-gray-300 mb-1">
                {{ op.subtitle }}
              </p>
              <h2 class="text-2xl sm:text-3xl font-bold leading-tight tracking-tight" :class="op.metricColorClass">
                {{ op.metric }}
              </h2>
            </div>
            <div
              class="w-11 h-11 shrink-0 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-45 bg-white/75 dark:bg-white/10 shadow-xs">
              <UIcon name="i-lucide-arrow-up-right" class="w-5 h-5 text-carbon-900 dark:text-white" />
            </div>
          </div>

          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center shadow-md"
              :class="op.iconBgClass">
              <UIcon :name="op.icon" class="w-6 h-6 text-white" />
            </div>
            <div>
              <p class="text-xs font-bold text-carbon-900 dark:text-white">
                {{ op.title }}
              </p>
              <p class="text-xs text-sage-600 dark:text-gray-300 mt-0.5">
                {{ op.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
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

const cards = computed(() => [
  {
    subtitle: `Mi Dividendo (${cfoStore.currentPartner.equityPct}%)`,
    metric: formatCurrency(cfoStore.partnerDividendMxn),
    title: 'Bóveda del Socio',
    description: `+${formatCurrency(cfoStore.partnerProjectedWeekendBonusMxn)} proyectados este fin de semana`,
    icon: 'i-lucide-wallet',
    to: '/pulso',
    metricColorClass: 'text-carbon-900 dark:text-[#D4E157]',
    iconBgClass: 'bg-gradient-to-br from-[#8B80F9] to-[#6C5CE7] shadow-indigo-500/25'
  },
  {
    subtitle: `Margen Neto ${cfoStore.pnlSummary.netMarginPct}%`,
    metric: formatCurrency(cfoStore.pnlSummary.netDistributableProfit),
    title: 'Estado de Resultados',
    description: 'Ver cascada de ventas, costos fijos y utilidad libre',
    icon: 'i-lucide-trending-up',
    to: '/pulso',
    metricColorClass: 'text-carbon-900 dark:text-white',
    iconBgClass: 'bg-gradient-to-br from-[#4CD97B] to-[#2BB656] shadow-emerald-500/25'
  },
  {
    subtitle: 'Auditoría SAT CFDI 4.0',
    metric: `${cfoStore.filteredAnomalies.filter(a => a.status === 'DETECTED').length} Alertas XML`,
    title: 'Proveedores & Costos',
    description: `${formatCurrency(cfoStore.pendingLeakageAmount)}/mes detectados en sobreprecios`,
    icon: 'i-lucide-file-search',
    to: '/sat',
    metricColorClass: 'text-carbon-900 dark:text-white',
    iconBgClass: 'bg-gradient-to-br from-[#67B8F7] to-[#3B9AE8] shadow-sky-500/25'
  },
  {
    subtitle: 'Gobierno Corporativo',
    metric: `${cfoStore.pendingGovernanceCount} Por Firmar`,
    title: 'Socios & Pagos',
    description: 'Autorización mancomunada de gastos y Cap Table',
    icon: 'i-lucide-shield-check',
    to: '/socios',
    metricColorClass: 'text-carbon-900 dark:text-[#D4E157]',
    iconBgClass: 'bg-gradient-to-br from-[#E879F9] to-[#C084FC] shadow-purple-500/25'
  }
])
</script>
