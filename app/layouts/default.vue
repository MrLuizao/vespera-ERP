<template>
  <div class="min-h-screen glass-mesh-bg pb-24 md:pb-10 transition-colors duration-300">
    <!-- Sidebar Flotante Izquierdo (Sin bordes blancos) -->
    <aside class="fixed left-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex">
      <div class="flex flex-col items-center gap-2 bg-[#0F172A]/85 dark:bg-[#090D16]/85 backdrop-blur-2xl rounded-full py-4 px-2 shadow-2xl">
        <UTooltip
          v-for="item in navItems"
          :key="item.to"
          :text="item.label"
          :content="{ side: 'right' }"
        >
          <NuxtLink
            :to="item.to"
            class="w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer"
            :class="isActive(item.to)
              ? 'bg-white/15 text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/10'"
          >
            <UIcon
              :name="item.icon"
              class="w-5 h-5"
            />
          </NuxtLink>
        </UTooltip>

        <div class="w-6 h-px bg-white/10 my-2" />

        <UColorModeButton
          color="neutral"
          variant="ghost"
          class="text-gray-400 hover:text-white hover:bg-white/10 rounded-full cursor-pointer"
        />

        <UTooltip
          text="Cerrar sesión"
          :content="{ side: 'right' }"
        >
          <button
            class="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-error-400 hover:bg-white/10 transition-all cursor-pointer"
            @click="handleLogout"
          >
            <UIcon
              name="i-lucide-log-out"
              class="w-5 h-5"
            />
          </button>
        </UTooltip>
      </div>
    </aside>

    <!-- Dock Flotante Inferior en Móvil (Sin bordes blancos) -->
    <nav class="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex md:hidden items-center gap-2 bg-[#0F172A]/85 dark:bg-[#090D16]/85 backdrop-blur-2xl rounded-full px-4 py-2 shadow-2xl">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer"
        :class="isActive(item.to)
          ? 'bg-white/15 text-white'
          : 'text-gray-400 hover:text-white'"
      >
        <UIcon
          :name="item.icon"
          class="w-5 h-5"
        />
      </NuxtLink>
      <div class="w-px h-6 bg-white/10 mx-1" />
      <UColorModeButton
        color="neutral"
        variant="ghost"
        class="text-gray-400 hover:text-white rounded-full cursor-pointer"
      />
    </nav>

    <!-- Header Superior con USelect de Nuxt UI (Tamaño grande y cómodo en móvil):
         Móvil -> Fila 1: Logo (izq) + USelect Grupo (der) | Fila 2: USelect Socio (100% ancho)
         Web   -> 1 sola fila: Logo (izq) + USelect Grupo y USelect Socio (der) -->
    <header class="pt-5 px-4 sm:px-6 md:pl-28 md:pr-10">
      <div class="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <!-- 1. Logo y Nombre (Izquierda) -->
        <NuxtLink
          to="/main"
          class="flex items-center shrink-0"
        >
        
          <div class="py-2.5 flex items-center gap-2.5">
            <!-- <div class="w-7 h-7 rounded-full bg-gradient-to-br from-[#8B80F9] to-[#635BFF] flex items-center justify-center shrink-0">
              <UIcon
                name="i-lucide-landmark"
                class="w-4 h-4 text-white"
              />
            </div> -->
            <span class="font-bold text-base tracking-tight text-carbon-900 dark:text-white">
              VESPERA <span class="text-primary-500 dark:text-[#D4E157]">ERP</span>
            </span>
          </div>
        </NuxtLink>

        <!-- 2. Combo de Grupo / Sucursal con USelect size="lg" (Derecha en Fila 1 móvil / Derecha en web) -->
        <div class="sm:ml-auto bg-white/60 dark:bg-white/[0.08] backdrop-blur-2xl rounded-full px-2 py-1 shadow-sm flex items-center shrink-0">
          <USelect
            v-model="cfoStore.selectedVenueId"
            :items="venueItems"
            icon="i-lucide-building-2"
            variant="none"
            size="lg"
            class="cursor-pointer"
            :ui="{
              base: 'rounded-full font-semibold text-sm sm:text-base text-carbon-900 dark:text-white cursor-pointer ps-9 pe-8 py-1.5',
              leadingIcon: 'text-sage-600 dark:text-slate-300 w-5 h-5',
              trailingIcon: 'text-sage-500 dark:text-slate-300 w-5 h-5',
              content: 'rounded-2xl bg-white/95 dark:bg-carbon-900/95 backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/10 shadow-xl min-w-[190px]',
              item: 'rounded-xl text-sm py-2.5 font-medium cursor-pointer'
            }"
          />
        </div>

        <!-- 3. Combo de Socios con USelect size="lg" (Solo en vistas que lo requieran como /main y /pulso; oculto en /sat y /socios) -->
        <div
          v-if="showPartnerSelector"
          class="w-full sm:w-auto bg-white/60 dark:bg-white/[0.08] backdrop-blur-2xl rounded-full pl-2 pr-2.5 py-1.5 shadow-sm flex items-center gap-2"
        >
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
            :class="cfoStore.currentPartner.role === 'Socio Director' ? 'bg-[#D4E157] text-carbon-950' : 'bg-primary-500 text-white'"
          >
            {{ cfoStore.currentPartner.avatarInitials }}
          </div>

          <USelect
            v-model="cfoStore.selectedPartnerId"
            :items="partnerItems"
            variant="none"
            size="lg"
            class="w-full sm:w-auto flex-1 cursor-pointer"
            :ui="{
              base: 'w-full rounded-full font-semibold text-sm sm:text-base text-carbon-900 dark:text-white cursor-pointer ps-1.5 pe-8 py-1.5',
              trailingIcon: 'text-sage-500 dark:text-slate-300 w-5 h-5',
              content: 'rounded-2xl bg-white/95 dark:bg-carbon-900/95 backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/10 shadow-xl min-w-[240px]',
              item: 'rounded-xl text-sm py-2.5 font-medium cursor-pointer'
            }"
          />
        </div>
      </div>
    </header>

    <main class="px-4 sm:px-6 md:pl-28 md:pr-10 py-6 sm:py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useCfoStore } from '~/stores/cfo'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const cfoStore = useCfoStore()
const authStore = useAuthStore()
const { confirmLogout } = useConfirmModal()

const navItems = [
  { to: '/main', icon: 'i-lucide-layout-dashboard', label: 'Panel Principal' },
  { to: '/pulso', icon: 'i-lucide-trending-up', label: 'Punto de Equilibrio & P&L' },
  { to: '/flujo', icon: 'i-lucide-sparkles', label: 'Flujo Predictivo 13-S (IA)' },
  { to: '/sat', icon: 'i-lucide-file-search', label: 'Auditoría SAT & Proveedores' },
  { to: '/socios', icon: 'i-lucide-users', label: 'Bóveda de Socios & Firmas' }
]

const venueItems = [
  { label: 'Grupo (3)', value: 'all' },
  { label: 'WoodNest', value: 'woodnest' },
  { label: 'Kuroi', value: 'kuroi' },
  { label: 'Ámbar', value: 'ambar' }
]

const partnerItems = computed(() =>
  cfoStore.partners.map(p => ({
    label: `${p.name} (${p.equityPct}%)`,
    value: p.id
  }))
)

// En /sat y /socios no tiene sentido el selector de socio (en /sat es auditoría fiscal y en /socios rige la sesión activa)
const showPartnerSelector = computed(() => {
  return !['/sat', '/socios'].includes(route.path)
})

onMounted(() => {
  if (authStore.user?.id) {
    cfoStore.setPartner(authStore.user.id)
  }
})

function isActive(to: string) {
  const path = to.split('?')[0]
  return route.path === path
}

async function handleLogout() {
  const confirmed = await confirmLogout()
  if (confirmed) {
    await authStore.logout()
  }
}
</script>
