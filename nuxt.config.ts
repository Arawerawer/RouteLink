// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["./app/assets/css/main.css"],

  app: {
    head: {
      title: "RouteLink",
      link: [
        { rel: "icon", type: "image/png", href: "/pwa-192x192.png" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      ],
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  modules: ["@nuxtjs/supabase", "@nuxt/icon", "@pinia/nuxt", "@vite-pwa/nuxt"],

  supabase: {
    redirect: false,
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
  },

  pwa: {
    devOptions: {
      enabled: false,
    },
    registerType: "autoUpdate",
    manifest: {
      name: "RouteLink",
      short_name: "RouteLink",
      description: "計畫數位化，行程更精準",
      theme_color: "#1e3a5f",
      background_color: "#1e3a5f",
      display: "standalone",
      start_url: "/",
      orientation: "portrait",
      icons: [
        {
          src: "/pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
  },
});
