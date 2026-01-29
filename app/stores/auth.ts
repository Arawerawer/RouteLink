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
      const { error } = await client.auth.signOut({ scope: "local" });

      if (error) {
        throw error;
      }

      navigateTo("/");
    } catch (error) {
      alert("登出失敗");
      console.error("登出失敗:", error);
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
