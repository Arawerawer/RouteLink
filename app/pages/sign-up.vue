<script setup lang="ts">
definePageMeta({
  hideNavbar: true,
  middleware: "guest",
});

const client = useSupabaseClient();
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMsg = ref<string | null>(null);
// const successMsg = ref<string | null>(null);
const loading = ref(false);

async function signUp() {
  errorMsg.value = null;

  if (!email.value.trim()) {
    errorMsg.value = "請輸入 Email";
    return;
  }

  if (!password.value.trim()) {
    errorMsg.value = "請輸入密碼";
    return;
  }

  if (password.value.length < 6) {
    errorMsg.value = "密碼至少 6 個字元";
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMsg.value = "密碼不一致";
    return;
  }

  loading.value = true;

  try {
    const { data, error } = await client.auth.signUp({
      email: email.value,
      password: password.value,
    });

    if (error) {
      throw error;
    }

    navigateTo("/login");
  } catch (error) {
    errorMsg.value = "註冊失敗";
    console.error(error);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div
    class="w-full min-h-screen flex justify-center items-center relative"
    :class="{ 'pointer-events-none': loading }"
  >
    <button
      class="w-12 h-12 px-3 pt-3 pb-px left-6 top-4 absolute bg-white/10 rounded-2xl outline-1 outline-offset-1 outline-white/20 flex flex-col justify-start items-start cursor-pointer hover:bg-white/20"
      @click="navigateTo('/')"
    >
      <img src="/arrow.svg" alt="arrow" />
    </button>

    <div
      class="w-87.5 h-125.5 lg:w-md lg:h-164.5 px-12 py-6 bg-white/10 rounded-[20px] shadow-lg outline-1 outline-offset-1 outline-white/20 inline-flex flex-col justify-center items-center gap-10 lg:gap-28"
    >
      <div class="w-full flex flex-col justify-center items-center gap-7">
        <div
          class="text-center text-white text-4xl font-bold font-['Noto_Sans_TC'] leading-10"
        >
          RouteLink
        </div>
        <div
          class="text-center text-white/70 text-lg font-normal font-['Noto_Sans_TC'] leading-7"
        >
          請註冊以繼續
        </div>
      </div>

      <form
        @submit.prevent="signUp"
        class="w-full flex flex-col justify-center items-center gap-6 relative"
      >
        <div v-if="errorMsg" class="absolute -top-8 text-red-400 text-sm">
          {{ errorMsg }}
        </div>

        <input
          v-model="email"
          type="email"
          placeholder="註冊帳號 (Email)"
          class="w-full px-6 py-4 bg-white/10 rounded-2xl outline-1 outline-offset-1 outline-white/20 focus:outline-white/50 text-white/50 text-lg font-normal font-['Noto_Sans_TC'] placeholder:text-white/50"
        />

        <input
          v-model="password"
          type="password"
          placeholder="註冊密碼"
          class="w-full px-6 py-4 bg-white/10 rounded-2xl outline-1 outline-offset-1 outline-white/20 focus:outline-white/50 text-white/50 text-lg font-normal font-['Noto_Sans_TC'] placeholder:text-white/50"
        />
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="密碼確認"
          class="w-full px-6 py-4 bg-white/10 rounded-2xl outline-1 outline-offset-1 outline-white/20 focus:outline-white/50 text-white/50 text-lg font-normal font-['Noto_Sans_TC'] placeholder:text-white/50"
        />

        <button
          type="submit"
          :disabled="loading"
          class="w-full h-14 bg-white/10 rounded-2xl outline-1 outline-offset-1 outline-white/20 flex justify-center items-center gap-2.5 cursor-pointer hover:bg-white/20 disabled:opacity-50 text-center text-white text-lg font-medium font-['Noto_Sans_TC'] leading-7"
        >
          <Icon
            v-if="loading"
            name="svg-spinners:270-ring-with-bg"
            class="w-6 h-6"
          />
          <span v-else>註冊</span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
