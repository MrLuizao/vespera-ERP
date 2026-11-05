<script setup lang="ts">
import { useCfoStore } from '~/stores/cfo'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const cfoStore = useCfoStore()
const authStore = useAuthStore()
const { confirmLogout } = useConfirmModal()
const navigation = useTemplateRef<HTMLElement>('navigation')
const navItems = [
  { to: '/main', icon: 'i-lucide-layout-dashboard', label: 'Panel', name: 'Panel Principal' },
  { to: '/pulso', icon: 'i-lucide-trending-up', label: 'Pulso', name: 'Pulso: Punto de Equilibrio & P&L' },
  { to: '/flujo', icon: 'i-lucide-sparkles', label: 'Flujo IA', name: 'Flujo IA: Flujo Predictivo 13-S' },
  { to: '/sat', icon: 'i-lucide-file-search', label: 'SAT', name: 'SAT: Auditoría & Proveedores' },
  { to: '/socios', icon: 'i-lucide-users', label: 'Socios', name: 'Socios: Bóveda & Firmas' }
]
const venueItems = [
  { label: 'Grupo (3)', value: 'all' },
  { label: 'WoodNest', value: 'woodnest' },
  { label: 'Kuroi', value: 'kuroi' },
  { label: 'Ámbar', value: 'ambar' }
]
const partnerItems = computed(() => cfoStore.partners.map(p => ({
  label: `${p.name} (${p.equityPct}%)`, value: p.id
})))
const showPartnerSelector = computed(() => !['/sat', '/socios'].includes(route.path))

function revealActiveRoute() {
  navigation.value?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
}
watch(() => route.path, () => nextTick(revealActiveRoute))
onMounted(() => {
  if (authStore.user?.id) cfoStore.setPartner(authStore.user.id)
  revealActiveRoute()
})
async function handleLogout() {
  const confirmed = await confirmLogout()
  if (confirmed) await authStore.logout()
}
</script>

<template>
  <div class="min-h-screen glass-mesh-bg pb-10">
    <a href="#main-content" class="skip-link rounded-xl">Saltar al contenido</a>
    <header class="glass-overlay !rounded-none !border-x-0 !border-t-0">
      <div class="shell-container">
        <div class="shell-top">
          <NuxtLink to="/main" class="text-xl font-bold tracking-tight w-fit" aria-label="Vespera ERP: Panel principal">
            Vespera<span class="text-primary">ERP</span>
          </NuxtLink>
          <nav ref="navigation" class="shell-nav glass-panel" aria-label="Navegación principal">
            <div class="shell-nav-links">
              <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" :aria-label="item.name" :aria-current="route.path === item.to ? 'page' : undefined">
                <UIcon :name="item.icon" class="size-4 shrink-0" aria-hidden="true" />
                {{ item.label }}
              </NuxtLink>
            </div>
          </nav>
          <div class="flex items-center justify-end gap-2">
            <UColorModeButton color="neutral" variant="ghost" aria-label="Cambiar tema" class="min-w-11" />
            <UButton color="neutral" variant="ghost" icon="i-lucide-log-out" aria-label="Cerrar sesión" class="min-w-11" @click="handleLogout" />
          </div>
        </div>
        <div class="shell-context">
          <label for="venue-context">
            <span>Sucursal</span>
            <USelect id="venue-context" v-model="cfoStore.selectedVenueId" :items="venueItems" icon="i-lucide-building-2" class="min-w-0 flex-1" />
          </label>
          <label v-if="showPartnerSelector" for="partner-context">
            <span>Socio</span>
            <USelect id="partner-context" v-model="cfoStore.selectedPartnerId" :items="partnerItems" icon="i-lucide-user" class="min-w-0 flex-1" />
          </label>
        </div>
      </div>
    </header>
    <main id="main-content" tabindex="-1" class="shell-container py-6 lg:py-8">
      <slot />
    </main>
  </div>
</template>
