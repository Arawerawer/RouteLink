<script setup lang="ts">
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axios from "axios";

interface Schedule {
  id: string;
  name: string;
  note: string | null;
}

const model = defineModel<Schedule | null>();

const queryClient = useQueryClient();

const note = ref("");
const errorMsg = ref<string | null>(null);

// 當 model 改變時，填入資料
watch(model, (schedule) => {
  if (schedule) {
    note.value = schedule.note || "";
  }
});

// 更新 mutation
const { mutate: updateNote, isPending: isUpdating } = useMutation({
  mutationFn: async (schedule: Schedule) => {
    const { data: res } = await axios.put(`/api/schedules/${schedule.id}`, {
      note: schedule.note,
    });
    return res;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["schedules"] });
    model.value = null;
  },
  onError: (error: any) => {
    errorMsg.value = "儲存失敗，請稍後再試";
    console.error("儲存失敗:", error);
  },
});

// 更新
const update = () => {
  if (!model.value) return;

  updateNote({
    ...model.value,
    note: note.value,
  });
};

const close = () => {
  model.value = null;
  errorMsg.value = null;
};
</script>

<template>
  <Teleport to="body">
    <div
      v-if="model"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    >
      <div
        class="w-80 lg:w-md h-107.75 p-8 bg-white/10 rounded-[20px] shadow-lg outline-1 outline-offset-1 outline-white/20 flex flex-col justify-center items-center gap-6"
        @click.stop
      >
        <div class="w-full flex justify-between items-center">
          <div
            class="w-full text-white text-2xl font-bold font-['Noto_Sans_TC'] leading-8"
          >
            編輯備註
          </div>

          <button
            class="w-6 h-6 flex flex-col justify-center items-center cursor-pointer hover:bg-white/20 rounded-lg transition-colors"
            @click="close"
          >
            <img src="/cross2.svg" alt="cross" />
          </button>
        </div>

        <div
          class="w-full justify-start text-white/80 text-lg font-normal font-['Noto_Sans_TC'] leading-7"
        >
          {{ model.name }}
        </div>

        <div
          class="w-full flex flex-col justify-center items-center gap-4 relative"
        >
          <div v-if="errorMsg" class="absolute -top-6 text-red-400 text-sm">
            {{ errorMsg }}
          </div>

          <textarea
            v-model="note"
            placeholder="輸入備註..."
            class="w-full h-48 px-4 py-3 bg-white/10 rounded-2xl outline-1 outline-offset-1 outline-white/20 focus:outline-white/50 text-white text-lg font-normal font-['Noto_Sans_TC'] placeholder:text-white/50 resize-none"
          ></textarea>

          <button
            :disabled="isUpdating"
            class="w-full h-12 bg-white/10 rounded-2xl outline-1 outline-offset-1 outline-white/20 flex justify-center items-center cursor-pointer hover:bg-white/20 disabled:opacity-50 text-center text-white text-base font-medium font-['Noto_Sans_TC'] leading-6"
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
  </Teleport>
</template>

<style scoped></style>
