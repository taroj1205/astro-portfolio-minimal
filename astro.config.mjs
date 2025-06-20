// @ts-check
import mdx from '@astrojs/mdx'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  devToolbar: {
    enabled: false,
  },
  scopedStyleStrategy: 'class',
})
