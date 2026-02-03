// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";


// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: "static",
  image: {
    domains: ["https://rickandmortyapi.com/api/character/avatar/"],
    remotePatterns: [{ protocol: "https", hostname: "rickandmortyapi.com" }],
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: ["**/.cache/**"],
      },
    },
  },
});
