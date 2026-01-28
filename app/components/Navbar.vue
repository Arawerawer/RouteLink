<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const auth = useAuthStore();
</script>

<template>
  <div
    class="w-full p-6 fixed left-0 top-0 z-10 flex flex-col justify-center items-center"
  >
    <div
      class="w-full px-6 py-4 bg-white/10 rounded-[20px] shadow-lg outline-1 -outline-offset-1 outline-white/20 flex flex-col justify-center items-center"
    >
      <div class="w-full flex justify-between items-center relative">
        <div
          class="text-white text-base lg:text-2xl font-bold font-['Noto_Sans_TC'] leading-8"
        >
          RouteLink
        </div>
        <button
          v-if="!auth.isLoggedIn"
          class="absolute right-26 w-20 h-12 px-6 py-2 lg:py-3 bg-white/10 rounded-2xl outline-1 -outline-offset-1 outline-white/20 flex justify-center items-center cursor-pointer hover:bg-white/20 text-center text-white text-base font-medium font-['Noto_Sans_TC'] leading-6"
          @click="navigateTo('/sign-up')"
        >
          註冊
        </button>

        <button
          v-if="auth.isLoggedIn"
          :disabled="auth.loading"
          class="w-20 h-12 px-6 py-2 lg:py-3 bg-white/10 rounded-2xl outline-1 -outline-offset-1 outline-white/20 flex justify-center items-center cursor-pointer hover:bg-white/20 disabled:opacity-50 text-center text-white text-base font-medium font-['Noto_Sans_TC'] leading-6"
          @click="auth.logout()"
        >
          <Icon
            v-if="auth.loading"
            name="svg-spinners:270-ring-with-bg"
            class="w-6 h-6"
          />
          <span v-else>登出</span>
        </button>

        <button
          v-if="!auth.isLoggedIn"
          class="w-20 h-12 px-6 py-3 bg-white/10 rounded-2xl outline-1 -outline-offset-1 outline-white/20 flex justify-center items-center cursor-pointer hover:bg-white/20 text-center text-white text-base font-medium font-['Noto_Sans_TC'] leading-6"
          @click="navigateTo('/login')"
        >
          登入
        </button>
      </div>
    </div>
  </div>
</template>
