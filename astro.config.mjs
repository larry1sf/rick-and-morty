// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import vercel from "@astrojs/vercel";

import clerk from "@clerk/astro";

import { esES } from '@clerk/localizations'

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    clerk({
      localization: esES,
      appearance: {
        userButton: {
          variables: {
            colorRing: "transparent",
            colorBorder: "transparent",
          }
        },
        variables: {
          colorPrimary: "var(--color-primary)",
          colorBackground: "#111",
          colorInputBackground: "#1c1c1c",
          colorInputText: "#fff",
          colorText: "#fff",
          colorTextSecondary: "#d1d1d6",
          colorTextOnPrimaryBackground: "#000",
          colorNeutral: "#fff",
          colorDanger: "#ef4444",
          colorSuccess: "#22c55e",
        },
      },
    }),
  ],
  output: "server",
  adapter: vercel(),
  image: {
    domains: ["https://rickandmortyapi.com/api/character/avatar/"],
    remotePatterns: [{ protocol: "https", hostname: "rickandmortyapi.com" }],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
