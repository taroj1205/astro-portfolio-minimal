// @ts-check
import mdx from '@astrojs/mdx'
import { imageService } from '@unpic/astro/service'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  image: {
    service: imageService(),
  },
  devToolbar: {
    enabled: false,
  },
  scopedStyleStrategy: 'class',
  build: {
    inlineStylesheets: 'always',
  },
})
