<script setup lang="ts">
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axios from "axios";

interface Location {
  id: string;
  name: string;
  address: string;
}

const model = defineModel<Location | null>();

const queryClient = useQueryClient();

const name = ref("");
const address = ref("");
const errorMsg = ref<string | null>(null);

// 當 model 改變時，填入資料
watch(model, (location) => {
  if (location) {
    name.value = location.name;
    address.value = location.address;
  }
});

const close = () => {
  model.value = null;
  errorMsg.value = null;
};

// 刪除 mutation
const { mutate: deleteLocation, isPending: isDeleting } = useMutation({
  mutationFn: async (id: string) => {
    const { data: res } = await axios.delete(`/api/locations/${id}`);
    return res;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["locations"] });
    queryClient.invalidateQueries({ queryKey: ["schedules"] });
    model.value = null;
  },
  onError: (error: any) => {
    errorMsg.value = "刪除失敗，請稍後再試";
    console.error("刪除失敗:", error);
  },
});

// 更新 mutation
const { mutate: updateLocation, isPending: isUpdating } = useMutation({
  mutationFn: async (location: Location) => {
    const { data: res } = await axios.put(`/api/locations/${location.id}`, {
      name: location.name,
      address: location.address,
    });
    return res;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["locations"] });
    queryClient.invalidateQueries({ queryKey: ["schedules"] });
    model.value = null;
  },
  onError: (error: any) => {
    errorMsg.value = "儲存失敗，請稍後再試";
    console.error("儲存失敗:", error);
  },
});

// 刪除
const remove = () => {
  if (!model.value) return;
  deleteLocation(model.value.id);
};

// 更新
const update = () => {
  if (!model.value) return;

  if (!name.value.trim() || !address.value.trim()) {
    errorMsg.value = "請填寫所有欄位";
    return;
  }

  updateLocation({
    ...model.value,
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
            編輯地點
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

          <div class="w-full flex justify-center items-center gap-3">
            <button
              :disabled="isDeleting"
              class="w-full px-6 py-3 bg-white/10 rounded-2xl outline-1 outline-offset-1 outline-white/20 flex justify-center items-center cursor-pointer hover:bg-white/20 disabled:opacity-50 text-center text-red-300 text-base font-medium font-['Noto_Sans_TC'] leading-6"
              @click="remove"
            >
              <Icon
                v-if="isDeleting"
                name="svg-spinners:270-ring-with-bg"
                class="w-5 h-5"
              />
              <span v-else>刪除</span>
            </button>

            <button
              :disabled="isUpdating"
              class="w-full px-6 py-3 bg-white/10 rounded-2xl outline-1 outline-offset-1 outline-white/20 flex justify-center items-center cursor-pointer hover:bg-white/20 disabled:opacity-50 text-center text-white text-base font-medium font-['Noto_Sans_TC'] leading-6"
              @click="update"
            >
              <Icon
                v-if="isUpdating"
                name="svg-spinners:270-ring-with-bg"
                class="w-5 h-5"
              />
              <span v-else>儲存</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped></style>
