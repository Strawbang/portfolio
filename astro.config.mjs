import { defineConfig } from "astro/config";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://djamel-bougouffa.com",
  integrations: [robotsTxt(), sitemap()],
});