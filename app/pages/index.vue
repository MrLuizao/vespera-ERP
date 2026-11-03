<script setup lang="ts">
const tokenCookie = useCookie<string | null>('cfo_auth_token')
const userCookie = useCookie<any>('cfo_user')

if (tokenCookie.value && userCookie.value) {
  await navigateTo('/main', { replace: true })
} else {
  await navigateTo('/login', { replace: true })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-8 h-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
  </div>
</template>
