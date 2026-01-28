import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const client = useSupabaseClient();
  const user = useSupabaseUser();
  const loading = ref(false);

  const isLoggedIn = computed(() => {
    if (user.value) {
      return true;
    }
    return false;
  });

  async function logout() {
    loading.value = true;
    try {
      await client.auth.signOut();
      navigateTo("/");
    } finally {
      loading.value = false;
    }
  }

  return {
    user,
    isLoggedIn,
    loading,
    logout,
  };
});
