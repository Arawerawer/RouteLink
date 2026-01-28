<script setup lang="ts">
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axios from "axios";

const model = defineModel<boolean>();

const queryClient = useQueryClient();

const name = ref("");
const address = ref("");
const errorMsg = ref<string | null>(null);

const close = () => {
  model.value = false;
  errorMsg.value = null;
};

// 新增地點 mutation
const { mutate: addLocation, isPending } = useMutation({
  mutationFn: async (data: { name: string; address: string }) => {
    const { data: response } = await axios.post("/api/locations", data);
    return response;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["locations"] });
    name.value = "";
    address.value = "";
    model.value = false;
  },
  onError: (error: any) => {
    errorMsg.value = "發生錯誤，請稍後再試";
    console.error("新增地點失敗:", error);
  },
});

const save = () => {
  errorMsg.value = null;

  if (!name.value.trim() || !address.value.trim()) {
    errorMsg.value = "請填寫所有欄位";
    return;
  }

  addLocation({
    name: name.value,
    address: address.value,
  });
};
</script>

<template>
  <!-- 對話框遮罩 - 使用 Teleport 傳送到 body -->
  <Teleport to="body">
    <div
      v-if="model"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    >
      <!-- 對話框內容 -->
      <div
        class="w-80 lg:w-96 h-80 p-8 bg-white/10 rounded-[20px] shadow-lg outline-1 outline-offset-1 outline-white/20 flex flex-col justify-center items-center gap-6"
        @click.stop
      >
        <div class="w-full flex justify-between items-center">
          <div
            class="justify-start text-white text-2xl font-bold font-['Noto_Sans_TC'] leading-8"
          >
            新增地點
          </div>

          <button
            class="w-6 h-6 flex flex-col justify-center items-center cursor-pointer hover:bg-white/20 rounded-lg transition-colors"
            @click="close"
          >
            <img src="/cross2.svg" alt="cross" />
          </button>
        </div>

        <div
          class="w-full flex flex-col justify-center items-center gap-4 relative"
        >
          <div v-if="errorMsg" class="absolute -top-6 text-red-400 text-sm">
            {{ errorMsg }}
          </div>
          <input
            v-model="name"
            type="text"
            placeholder="地點名稱"
            class="w-full px-4 py-3 bg-white/10 rounded-2xl outline-1 outline-offset-1 outline-white/20 focus:outline-white/50 text-white text-lg font-normal font-['Noto_Sans_TC'] placeholder:text-white/50"
          />

          <input
            v-model="address"
            type="text"
            placeholder="地址"
            class="w-full px-4 py-3 bg-white/10 rounded-2xl outline-1 outline-offset-1 outline-white/20 focus:outline-white/50 text-white text-lg font-normal font-['Noto_Sans_TC'] placeholder:text-white/50"
          />

          <button
            :disabled="isPending"
            class="w-full h-12 bg-white/10 rounded-2xl outline-1 outline-offset-1 outline-white/20 flex justify-center items-center cursor-pointer hover:bg-white/20 disabled:opacity-50 text-center text-white text-base font-medium font-['Noto_Sans_TC'] leading-6"
            @click="save"
          >
            <Icon
              v-if="isPending"
              name="svg-spinners:270-ring-with-bg"
              class="w-5 h-5"
            />
            <span v-else>儲存</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped></style>
