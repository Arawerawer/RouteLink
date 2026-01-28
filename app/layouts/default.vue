<script setup lang="ts">
const route = useRoute()
const hideNavbar = computed(() => route.meta.hideNavbar)
</script>

<template>
  <div
    class="min-h-screen bg-cover bg-center bg-no-repeat"
    style="background-image: url('/ocean.png')"
  >
    <Navbar v-if="!hideNavbar" />
    <slot />
  </div>
</template>
