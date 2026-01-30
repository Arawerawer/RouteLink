<script setup lang="ts">
definePageMeta({
  middleware: "guest",
});
</script>

<template>
  <div
    class="w-full min-h-screen flex flex-col justify-center lg:justify-end items-center px-12 pt-30 pb-25 lg:pt-60 lg:pb-3 2xl:pb-25"
  >
    <div class="w-full flex flex-col justify-center items-center gap-16">
      <div
        class="w-full lg:w-126 flex flex-col justify-center items-center gap-5 lg:gap-10"
      >
        <div
          class="w-full flex flex-col justify-center items-center gap-2 lg:gap-7"
        >
          <div
            class="w-full text-center text-white text-3xl lg:text-7xl font-bold font-['Noto_Sans_TC'] leading-18"
          >
            終結瑣碎紀錄
          </div>

          <div
            class="w-full text-center text-white/90 text-sm lg:text-3xl font-normal font-['Noto_Sans_TC'] leading-9"
          >
            計畫數位化，行程更精準
          </div>
        </div>

        <button
          class="px-6 lg:px-12 py-2 lg:py-4 bg-white/10 rounded-2xl outline-1 -outline-offset-1 outline-white/20 flex justify-center items-center cursor-pointer hover:bg-white/20 text-center text-white text-base lg:text-xl font-medium font-['Noto_Sans_TC'] leading-7"
          @click="navigateTo('/login')"
        >
          立即開始
        </button>
      </div>

      <div class="w-full justify-center items-center gap-20 hidden lg:flex">
        <div
          class="w-full h-64 px-8 bg-white/10 rounded-[20px] shadow-lg outline-1 -outline-offset-1 outline-white/20 flex flex-col justify-center items-center"
        >
          <div class="w-full flex flex-col justify-center items-center gap-5">
            <img src="/mark.svg" alt="mark" />

            <div class="w-full flex flex-col justify-center items-center gap-1">
              <div
                class="text-center text-white text-xl font-bold font-['Noto_Sans_TC'] leading-7"
              >
                📍 常用地點
              </div>
              <div
                class="text-center text-white/80 text-lg font-normal font-['Noto_Sans_TC'] leading-7"
              >
                常跑的地址存起來，不用重複輸入
              </div>
            </div>
          </div>
        </div>

        <div
          class="w-full h-64 px-8 bg-white/10 rounded-[20px] shadow-lg outline-1 -outline-offset-1 outline-white/20 flex flex-col justify-center items-center"
        >
          <div class="w-full flex flex-col justify-center items-center gap-5">
            <img src="/file.svg" alt="file" />

            <div class="w-full flex flex-col justify-center items-center gap-1">
              <div
                class="text-center text-white text-xl font-bold font-['Noto_Sans_TC'] leading-7"
              >
                🗂️ 一鍵導入
              </div>
              <div
                class="text-center text-white/80 text-lg font-normal font-['Noto_Sans_TC'] leading-7"
              >
                選一選就能安排今日行程
              </div>
            </div>
          </div>
        </div>

        <div
          class="w-full h-64 px-8 bg-white/10 rounded-[20px] shadow-lg outline-1 -outline-offset-1 outline-white/20 flex flex-col justify-center items-center"
        >
          <div class="w-full flex flex-col justify-center items-center gap-5">
            <img src="/map.svg" alt="map" />

            <div class="w-full flex flex-col justify-center items-center gap-1">
              <div
                class="text-center text-white text-xl font-bold font-['Noto_Sans_TC'] leading-7"
              >
                🧭 快速導航
              </div>
              <div
                class="text-center text-white/80 text-lg font-normal font-['Noto_Sans_TC'] leading-7"
              >
                點一下直接開啟 Google Maps
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
