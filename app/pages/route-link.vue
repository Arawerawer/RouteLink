<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query";
import { type Schedule } from "~/composables/useSchedules";
import { type Location } from "~/composables/useLocations";
import axios from "axios";

definePageMeta({
  middleware: "auth",
});

const queryClient = useQueryClient();

const showAddLoactionDialog = ref(false);
const editingLocationDialog = ref<Location | null>(null);
const editingScheduleNoteDialog = ref<Schedule | null>(null);
const searchKeyword = ref("");
const activeSection = ref<"schedule" | "location">("schedule");

// 取得地點列表
const { data: locations } = useLocationsQuery();

// 取得行程列表
const { data: schedules } = useSchedulesQuery();

// 加入行程 mutation
const addSchedule = useAddSchedule();

// 判斷某個地點是否正在加入中
const isAddingLocation = (id: string) => {
  if (addSchedule.isPending.value && addSchedule.variables.value === id) {
    return true;
  }
  return false;
};

// 判斷某個地點是否已在行程中
const isLocationInSchedule = (id: string) => {
  if (!schedules.value) return false;
  return schedules.value.some((schedule) => {
    if (schedule.location_id === id) {
      return true;
    }
    return false;
  });
};

const removeSchedule = useRemoveSchedule();

// 判斷某個行程是否正在刪除中
const isRemovingSchedule = (id: string) => {
  if (removeSchedule.isPending.value && removeSchedule.variables.value === id) {
    return true;
  }
  return false;
};

// 更新行程完成狀態 mutation
const { mutate: toggleCompleted } = useToggleCompleted();

// 切換行程完成狀態
const handleToggleCompleted = (schedule: Schedule) => {
  toggleCompleted({
    ...schedule,
    completed: !schedule.completed,
  });
};

// 過濾後的地點列表
const filteredLocations = computed(() => {
  if (!locations.value) return [];
  const keyword = searchKeyword.value.trim().toLowerCase();
  if (!keyword) return locations.value;
  return locations.value.filter((location) => {
    if (location.name.toLowerCase().includes(keyword)) {
      return true;
    }
    return false;
  });
});

// 開啟 Google Map 搜尋地址
const openGoogleMap = (address: string) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  window.open(url, "_blank");
};

// 監聽 schedules，當全部完成時刪除所有行程
watch(
  schedules,
  async (newSchedules) => {
    if (!newSchedules || newSchedules.length === 0) return;
    const allCompleted = newSchedules.every((schedule) => schedule.completed);
    if (allCompleted) {
      for (const schedule of newSchedules) {
        await axios.delete(`/api/schedules/${schedule.id}`);
      }
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    }
  },
  { deep: true },
);
</script>

<template>
  <!-- Dialogs -->
  <ClientOnly>
    <AddLocationDialog v-model="showAddLoactionDialog" />
    <EditLocationDialog v-model="editingLocationDialog" />
    <EditScheduleNoteDialog v-model="editingScheduleNoteDialog" />
  </ClientOnly>

  <div
    class="w-full h-screen px-6 py-30 lg:px-6 lg:pt-30 lg:pb-4 flex justify-center items-center relative"
  >
    <div class="w-full h-full flex justify-center items-center gap-4">
      <!-- leftSection -->
      <div
        class="w-full h-full p-6 bg-black/10 rounded-[20px] shadow-lg outline-1 outline-offset-1 outline-white/20 flex-col justify-start items-center gap-4 overflow-auto lg:flex"
        :class="activeSection === 'location' ? 'flex' : 'hidden'"
      >
        <div class="w-full flex justify-between items-center">
          <div
            class="text-white text-2xl font-bold font-['Noto_Sans_TC'] leading-8"
          >
            常用地點庫
          </div>

          <button
            class="px-6 py-2.5 bg-white/10 rounded-2xl outline-1 outline-white/20 flex justify-center items-center gap-2 cursor-pointer hover:bg-white/20 text-white text-base font-medium font-['Noto_Sans_TC'] leading-6"
            @click="showAddLoactionDialog = true"
          >
            <img src="/plus.svg" alt="plus" />
            新增地點
          </button>
        </div>

        <div
          class="w-full p-3 bg-white/10 rounded-2xl outline-1 outline-white/20 focus-within:outline-white/50 flex justify-start items-center gap-2 relative"
        >
          <img src="/search.svg" alt="search" />
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜尋地點..."
            class="w-full bg-transparent text-white text-lg font-normal font-['Noto_Sans_TC'] placeholder:text-white/50 outline-none pr-8"
          />
          <button
            v-if="searchKeyword"
            class="absolute right-3 w-5 h-5 flex justify-center items-center cursor-pointer hover:opacity-70"
            @click="searchKeyword = ''"
          >
            <img src="/cross2.svg" alt="clear" class="w-4 h-4" />
          </button>
        </div>

        <div class="w-full flex flex-col justify-start items-center gap-3">
          <div
            v-for="location in filteredLocations"
            :key="location.id"
            class="w-full pl-12 pr-4 py-4 relative bg-white/10 rounded-[20px] shadow-lg outline-1 outline-white/20 flex flex-col justify-center items-center"
          >
            <div class="absolute top-5 left-[17.25px]">
              <img src="/mark2.svg" alt="mark2" />
            </div>

            <div class="w-full flex justify-center items-center gap-3">
              <div
                class="w-full flex flex-col justify-center items-center gap-1"
              >
                <div
                  class="w-full text-white text-lg font-medium font-['Noto_Sans_TC'] leading-7 max-w-full break-all"
                >
                  {{ location.name }}
                </div>

                <div
                  class="w-full text-white/70 text-sm font-normal font-['Noto_Sans_TC'] leading-5 max-w-full break-all"
                >
                  {{ location.address }}
                </div>
              </div>

              <div class="flex justify-center items-center gap-3">
                <button
                  :disabled="
                    isAddingLocation(location.id) ||
                    isLocationInSchedule(location.id)
                  "
                  class="w-15 h-9 px-4 py-2 bg-white/10 rounded-2xl flex justify-center items-center cursor-pointer hover:bg-white/20 disabled:opacity-50 text-center text-white text-sm font-medium font-['Noto_Sans_TC'] leading-5"
                  @click="addSchedule.mutate(location.id)"
                >
                  <Icon
                    v-if="isAddingLocation(location.id)"
                    name="svg-spinners:270-ring-with-bg"
                    class="w-4 h-4"
                  />
                  <Icon
                    v-else-if="isLocationInSchedule(location.id)"
                    name="streamline-ultimate-color:check"
                    class="w-4 h-4"
                  />
                  <span v-else>加入</span>
                </button>

                <button
                  @click="editingLocationDialog = location"
                  class="w-8 h-9 px-2 bg-white/10 rounded-2xl flex flex-col justify-center items-center cursor-pointer hover:bg-white/20"
                >
                  <img src="/pen.svg" alt="pen" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- rightSection -->
      <div
        class="w-full h-full p-6 bg-black/10 rounded-[20px] shadow-lg outline-1 outline-offset-1 outline-white/20 flex-col justify-start items-center gap-4 overflow-auto lg:flex"
        :class="activeSection === 'schedule' ? 'flex' : 'hidden'"
      >
        <!-- 今日行程 -->
        <div
          class="text-white text-2xl font-bold font-['Noto_Sans_TC'] leading-8"
        >
          今日行程
        </div>
        <!-- 行程卡片 -->
        <div class="w-full flex flex-col justify-start items-center gap-3">
          <div
            v-for="schedule in schedules"
            :key="schedule.id"
            class="w-full pl-12 pr-5 py-3 relative bg-white/10 rounded-[20px] shadow-lg outline-1 outline-white/20 flex justify-center items-start transition-opacity"
            :class="schedule.completed ? 'opacity-50' : ''"
          >
            <button
              class="w-6 h-6 left-3.75 top-3.5 absolute rounded border-2 cursor-pointer flex justify-center items-center"
              :class="
                schedule.completed
                  ? 'border-green-400 bg-green-400/20'
                  : 'border-white/30 hover:border-white/50'
              "
              @click="handleToggleCompleted(schedule)"
            >
              <Icon
                v-if="schedule.completed"
                name="mdi:check"
                class="w-4 h-4 text-green-400"
              />
            </button>

            <div class="w-full flex flex-col justify-center items-center gap-3">
              <div
                class="w-full text-white text-lg font-medium font-['Noto_Sans_TC'] leading-7 max-w-full break-all"
              >
                {{ schedule.name }}
              </div>

              <div
                class="w-full text-white/70 text-sm font-normal font-['Noto_Sans_TC'] leading-5 max-w-full break-all"
              >
                {{ schedule.address }}
              </div>
              <button
                class="w-full text-left text-sky-200 text-sm font-medium font-['Noto_Sans_TC'] leading-5 cursor-pointer hover:text-sky-100 max-w-full break-all"
                @click="editingScheduleNoteDialog = schedule"
              >
                {{ schedule.note ? schedule.note : "📝 新增備註..." }}
              </button>
            </div>

            <div class="flex justify-center items-center gap-2">
              <button
                class="w-9 h-9 px-2 bg-white/10 rounded-2xl flex flex-col justify-center items-center cursor-pointer hover:bg-white/20"
                @click="openGoogleMap(schedule.address)"
              >
                <img src="/map2.svg" alt="map2" />
              </button>

              <button
                :disabled="isRemovingSchedule(schedule.id)"
                class="w-9 h-9 px-2 bg-white/10 rounded-2xl flex flex-col justify-center items-center cursor-pointer hover:bg-white/20 disabled:opacity-50"
                @click="removeSchedule.mutate(schedule.id)"
              >
                <Icon
                  v-if="isRemovingSchedule(schedule.id)"
                  name="svg-spinners:270-ring-with-bg"
                  class="w-4 h-4"
                />
                <img v-else src="/cross.svg" alt="cross" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <nav
        class="w-full px-6 py-4 left-0 right-0 bottom-0 absolute flex justify-center items-center gap-2.5 lg:hidden"
      >
        <div
          class="w-full h-20 px-7 bg-white/10 rounded-[20px] outline-1 outline-offset-[-1.05px] outline-white/20 flex justify-between items-center"
        >
          <button
            class="w-24 py-2 rounded-2xl flex flex-col justify-center items-center gap-1 cursor-pointer group"
            :class="
              activeSection === 'schedule' ? 'bg-white/20' : 'hover:bg-white/20'
            "
            @click="activeSection = 'schedule'"
          >
            <img src="/home.svg" alt="home" />

            <div class="w-full flex justify-center items-center">
              <div
                class="text-center text-sm font-medium font-['Noto_Sans_TC'] leading-5"
                :class="
                  activeSection === 'schedule'
                    ? 'text-white'
                    : 'text-white/60 group-hover:text-white'
                "
              >
                今日行程
              </div>
            </div>
          </button>

          <button
            class="w-24 py-2 rounded-2xl flex flex-col justify-center items-center gap-1 cursor-pointer group"
            :class="
              activeSection === 'location' ? 'bg-white/20' : 'hover:bg-white/20'
            "
            @click="activeSection = 'location'"
          >
            <img src="/store.svg" alt="store" />

            <div class="w-full h-5 flex justify-center items-center">
              <div
                class="text-center text-sm font-medium font-['Noto_Sans_TC'] leading-5"
                :class="
                  activeSection === 'location'
                    ? 'text-white'
                    : 'text-white/60 group-hover:text-white'
                "
              >
                地點庫
              </div>
            </div>
          </button>
        </div>
      </nav>
    </div>
  </div>
</template>

<style scoped>
/* 隱藏滾動條 */
.overflow-auto {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}
.overflow-auto::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}
</style>
