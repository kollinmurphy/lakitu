// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

import node from '@astrojs/node';

import db from '@astrojs/db';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    db({
      mode: "node"
    }),
  ],

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: node({
    mode: 'middleware'
  })
});
